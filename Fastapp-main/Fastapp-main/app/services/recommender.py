from typing import List, Dict, Any, Optional, Tuple
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import NMF
from scipy.sparse import csr_matrix
import pickle
import logging
from datetime import datetime
from pathlib import Path
import os

from app.models.recommendations import ModelData
from app.crud.recommendations import get_model_data, save_model_data
from app.schemas.recommendations import ModelDataCreate
from .augmented_recommender import AugmentedHybridRecommender

logger = logging.getLogger(__name__)

class HybridRecommender:
    def __init__(self, db_session):
        self.db = db_session
        self.content_model = None
        self.collaborative_model = None
        self.books_df = None
        self.user_item_matrix = None
        self.vectorizer = None
        self.model_name = "hybrid_recommender"
        self.augmented_model = None
        self.augmented_recommender = AugmentedHybridRecommender()
        self.load_model()

    def load_model(self) -> None:
        """Load both base and augmented models."""
        try:
            # Load base model from database
            model_data = get_model_data(self.db, self.model_name)
            if model_data:
                data = model_data.data
                try:
                    self.vectorizer = pickle.loads(data['vectorizer'])
                    self.content_model = pickle.loads(data['content_model'])
                    self.collaborative_model = pickle.loads(data['collaborative_model'])
                    self.books_df = pd.DataFrame(data['books_data'])
                    self.user_item_matrix = csr_matrix(data['user_item_matrix'])
                    logger.info(f"Loaded base recommendation model version {model_data.version}")
                except Exception as e:
                    logger.error(f"Error unpickling model data: {str(e)}")
                    raise

            # Load augmented model from file
            augmented_model_path = Path("ml_models/augmented_hybrid_model.pkl")
            if augmented_model_path.exists():
                try:
                    with open(augmented_model_path, 'rb') as f:
                        self.augmented_model = pickle.load(f)
                    logger.info("Loaded augmented hybrid model")
                except Exception as e:
                    logger.error(f"Error loading augmented model: {str(e)}")
                    raise
            else:
                logger.warning(f"Augmented hybrid model not found at {augmented_model_path}")

        except Exception as e:
            logger.error(f"Error loading models: {str(e)}")
            raise

    def save_model(self) -> None:
        """Save the current model state to the database."""
        try:
            # Ensure all required components are present
            if not all([self.vectorizer, self.content_model, self.collaborative_model, 
                       self.books_df is not None, self.user_item_matrix is not None]):
                raise ValueError("Missing required model components")

            # Prepare model data for storage
            model_data = {
                'vectorizer': pickle.dumps(self.vectorizer),
                'content_model': pickle.dumps(self.content_model),
                'collaborative_model': pickle.dumps(self.collaborative_model),
                'books_data': self.books_df.to_dict(),
                'user_item_matrix': self.user_item_matrix.toarray()
            }
            
            # Save to database
            save_model_data(
                self.db,
                ModelDataCreate(
                    name=self.model_name,
                    data=model_data
                )
            )
            logger.info("Successfully saved recommendation model")

            # Save augmented model to file
            augmented_model_path = Path("ml_models/augmented_hybrid_model.pkl")
            try:
                with open(augmented_model_path, 'wb') as f:
                    pickle.dump(self.augmented_model, f)
                logger.info("Successfully saved augmented model")
            except Exception as e:
                logger.error(f"Error saving augmented model: {str(e)}")
                raise

        except Exception as e:
            logger.error(f"Error saving model: {str(e)}")
            raise

    def prepare_data(
        self,
        books: List[Dict[str, Any]],
        user_activities: List[Dict[str, Any]]
    ) -> Tuple[pd.DataFrame, csr_matrix]:
        """Prepare data for model training."""
        try:
            # Prepare books data
            books_df = pd.DataFrame(books)
            books_df['content'] = books_df.apply(
                lambda x: f"{x['title']} {x['author']} {x['description']} {' '.join(x['genres'])}",
                axis=1
            )

            # Create user-item interaction matrix
            user_ids = {activity['user_id']: idx for idx, activity in enumerate(set(a['user_id'] for a in user_activities))}
            book_ids = {book['book_id']: idx for idx, book in enumerate(books)}
            
            matrix_data = []
            for activity in user_activities:
                if activity['user_id'] in user_ids and activity['book_id'] in book_ids:
                    matrix_data.append((
                        user_ids[activity['user_id']],
                        book_ids[activity['book_id']],
                        activity['interaction_score']
                    ))
            
            user_item_matrix = csr_matrix(
                (np.array([d[2] for d in matrix_data]),
                 (np.array([d[0] for d in matrix_data]),
                  np.array([d[1] for d in matrix_data]))),
                shape=(len(user_ids), len(book_ids))
            )

            return books_df, user_item_matrix

        except Exception as e:
            logger.error(f"Error preparing data: {str(e)}")
            raise

    def train(
        self,
        books: List[Dict[str, Any]],
        user_activities: List[Dict[str, Any]]
    ) -> None:
        """Train both content-based and collaborative filtering models."""
        try:
            # Prepare data
            self.books_df, self.user_item_matrix = self.prepare_data(books, user_activities)

            # Train content-based model
            self.vectorizer = TfidfVectorizer(
                max_features=5000,
                stop_words='english',
                ngram_range=(1, 2)
            )
            content_matrix = self.vectorizer.fit_transform(self.books_df['content'])
            self.content_model = cosine_similarity(content_matrix)

            # Train collaborative filtering model using NMF
            self.collaborative_model = NMF(n_components=64, init='random', random_state=42)
            self.collaborative_model.fit(self.user_item_matrix)

            # Save the trained model
            self.save_model()
            logger.info("Successfully trained and saved recommendation model")
        except Exception as e:
            logger.error(f"Error training model: {str(e)}")
            raise

    def get_content_recommendations(
        self,
        book_id: int,
        n_recommendations: int = 10
    ) -> List[Tuple[int, float]]:
        """Get content-based recommendations for a book."""
        try:
            book_idx = self.books_df[self.books_df['book_id'] == book_id].index[0]
            book_similarities = self.content_model[book_idx]
            similar_indices = np.argsort(book_similarities)[::-1][1:n_recommendations + 1]
            
            return [
                (self.books_df.iloc[idx]['book_id'], float(book_similarities[idx]))
                for idx in similar_indices
            ]
        except Exception as e:
            logger.error(f"Error getting content recommendations: {str(e)}")
            return []

    def get_collaborative_recommendations(
        self,
        user_id: int,
        n_recommendations: int = 10
    ) -> List[Tuple[int, float]]:
        """Get collaborative filtering recommendations for a user."""
        try:
            # Get user's interaction vector
            user_idx = list(self.user_item_matrix.getcol(user_id).nonzero()[0])
            if not user_idx:
                return []

            # Get user's latent features
            user_features = self.collaborative_model.transform(self.user_item_matrix[user_idx])
            
            # Get predictions for all items
            predictions = self.collaborative_model.inverse_transform(user_features)
            
            # Get top recommendations
            top_indices = np.argsort(predictions[0])[::-1][:n_recommendations]
            
            return [
                (self.books_df.iloc[idx]['book_id'], float(predictions[0][idx]))
                for idx in top_indices
            ]
        except Exception as e:
            logger.error(f"Error getting collaborative recommendations: {str(e)}")
            return []

    def get_hybrid_recommendations(
        self,
        user_id: int,
        n_recommendations: int = 10
    ) -> List[Dict[str, Any]]:
        """Get hybrid recommendations combining base and augmented models."""
        try:
            # Get recommendations from both models
            base_recs = self._get_base_recommendations(user_id, n_recommendations)
            augmented_recs = self.augmented_recommender.get_user_recommendations(
                user_id, n_recommendations
            )

            # Combine recommendations with weights
            combined_recs = {}
            for rec in base_recs:
                book_id = rec['book_id']
                combined_recs[book_id] = {
                    'score': rec['score'] * 0.6,  # 60% weight to base model
                    'reason': rec['reason']
                }

            for rec in augmented_recs:
                book_id = rec['book_id']
                if book_id in combined_recs:
                    combined_recs[book_id]['score'] += rec['score'] * 0.4  # 40% weight to augmented model
                else:
                    combined_recs[book_id] = {
                        'score': rec['score'] * 0.4,
                        'reason': rec['reason']
                    }

            # Sort and return top recommendations
            sorted_recs = sorted(
                combined_recs.items(),
                key=lambda x: x[1]['score'],
                reverse=True
            )

            return [
                {
                    'book_id': book_id,
                    'score': float(info['score']),
                    'reason': info['reason']
                }
                for book_id, info in sorted_recs[:n_recommendations]
            ]

        except Exception as e:
            logger.error(f"Error getting hybrid recommendations: {str(e)}")
            return []

    def _get_base_recommendations(
        self,
        user_id: int,
        n_recommendations: int = 10
    ) -> List[Dict[str, Any]]:
        """Get recommendations from the base model."""
        try:
            # Get content-based recommendations
            content_recs = self.get_content_recommendations(user_id, n_recommendations)
            
            # Get collaborative filtering recommendations
            collab_recs = self.get_collaborative_recommendations(user_id, n_recommendations)
            
            # Combine recommendations
            combined_recs = {}
            for book_id, score in content_recs:
                combined_recs[book_id] = {
                    'score': score * 0.4,  # 40% weight to content-based
                    'reason': "Based on book content similarity"
                }
            
            for book_id, score in collab_recs:
                if book_id in combined_recs:
                    combined_recs[book_id]['score'] += score * 0.6  # 60% weight to collaborative
                    combined_recs[book_id]['reason'] = "Based on both content and user behavior"
                else:
                    combined_recs[book_id] = {
                        'score': score * 0.6,
                        'reason': "Based on similar users' preferences"
                    }
            
            # Sort and return top recommendations
            sorted_recs = sorted(
                combined_recs.items(),
                key=lambda x: x[1]['score'],
                reverse=True
            )
            
            return [
                {
                    'book_id': book_id,
                    'score': float(info['score']),
                    'reason': info['reason']
                }
                for book_id, info in sorted_recs[:n_recommendations]
            ]
            
        except Exception as e:
            logger.error(f"Error getting base recommendations: {str(e)}")
            return []

    def get_similar_books(
        self,
        book_id: int,
        n_recommendations: int = 10
    ) -> List[Dict[str, Any]]:
        """Get similar books using both base and augmented models."""
        try:
            # Get recommendations from both models
            base_recs = self._get_base_similar_books(book_id, n_recommendations)
            augmented_recs = self.augmented_recommender.get_similar_books(
                book_id, n_recommendations
            )

            # Combine recommendations with weights
            combined_recs = {}
            for rec in base_recs:
                book_id = rec['book_id']
                combined_recs[book_id] = {
                    'score': rec['score'] * 0.6,  # 60% weight to base model
                    'reason': rec['reason']
                }

            for rec in augmented_recs:
                book_id = rec['book_id']
                if book_id in combined_recs:
                    combined_recs[book_id]['score'] += rec['score'] * 0.4  # 40% weight to augmented model
                else:
                    combined_recs[book_id] = {
                        'score': rec['score'] * 0.4,
                        'reason': rec['reason']
                    }

            # Sort and return top recommendations
            sorted_recs = sorted(
                combined_recs.items(),
                key=lambda x: x[1]['score'],
                reverse=True
            )

            return [
                {
                    'book_id': book_id,
                    'score': float(info['score']),
                    'reason': info['reason']
                }
                for book_id, info in sorted_recs[:n_recommendations]
            ]

        except Exception as e:
            logger.error(f"Error getting similar books: {str(e)}")
            return []

    def _get_base_similar_books(
        self,
        book_id: int,
        n_recommendations: int = 10
    ) -> List[Dict[str, Any]]:
        """Get similar books from the base model."""
        try:
            if self.books_df is None:
                return []

            # Get book features
            book_features = self.books_df[self.books_df['book_id'] == book_id]
            if book_features.empty:
                return []

            # Calculate similarity with other books
            similarities = cosine_similarity(
                book_features.drop(['book_id', 'title'], axis=1),
                self.books_df.drop(['book_id', 'title'], axis=1)
            )[0]

            # Get top similar books
            similar_indices = np.argsort(similarities)[::-1][1:n_recommendations + 1]
            similar_books = self.books_df.iloc[similar_indices]

            return [
                {
                    'book_id': row['book_id'],
                    'score': float(similarities[idx]),
                    'reason': f"Similar to {book_features['title'].iloc[0]}"
                }
                for idx, row in similar_books.iterrows()
            ]

        except Exception as e:
            logger.error(f"Error getting base similar books: {str(e)}")
            return [] 