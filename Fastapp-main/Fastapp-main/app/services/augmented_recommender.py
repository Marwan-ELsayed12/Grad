from typing import List, Dict, Any, Optional
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import logging
from pathlib import Path
import pickle
import os

logger = logging.getLogger(__name__)

class AugmentedHybridRecommender:
    def __init__(self):
        self.model = None
        self.books_df = None
        self.user_item_matrix = None
        self.load_model()

    def load_model(self) -> None:
        """Load the augmented hybrid model and data."""
        try:
            # Load processed data
            processed_df_path = Path("ml_models/processed_df.pkl")
            if processed_df_path.exists():
                with open(processed_df_path, 'rb') as f:
                    self.books_df = pickle.load(f)
                logger.info("Loaded processed books data")
            else:
                logger.warning(f"Processed books data not found at {processed_df_path}")
                return

            # Load collaborative data
            collaborative_path = Path("ml_models/colaborative.csv")
            if collaborative_path.exists():
                self.user_item_matrix = pd.read_csv(collaborative_path)
                logger.info("Loaded collaborative data")
            else:
                logger.warning(f"Collaborative data not found at {collaborative_path}")

            # Load the augmented model
            model_path = Path("ml_models/augmented_hybrid_model.pkl")
            if model_path.exists():
                with open(model_path, 'rb') as f:
                    self.model = pickle.load(f)
                logger.info("Loaded augmented hybrid model")
            else:
                logger.warning(f"Augmented hybrid model not found at {model_path}")

        except Exception as e:
            logger.error(f"Error loading augmented model data: {str(e)}")
            raise

    def get_user_recommendations(
        self,
        user_id: int,
        n_recommendations: int = 10
    ) -> List[Dict[str, Any]]:
        """Get personalized recommendations for a user."""
        try:
            if self.user_item_matrix is None:
                logger.warning("User-item matrix not loaded")
                return []

            # Get user's interaction history
            user_history = self.user_item_matrix[self.user_item_matrix['user_id'] == user_id]
            if user_history.empty:
                logger.info(f"No history found for user {user_id}")
                return []

            # Get similar users
            similar_users = self._get_similar_users(user_id)
            if not similar_users:
                logger.info(f"No similar users found for user {user_id}")
                return []
            
            # Get books liked by similar users
            recommendations = {}
            for similar_user in similar_users:
                user_books = self.user_item_matrix[
                    (self.user_item_matrix['user_id'] == similar_user) &
                    (self.user_item_matrix['rating'] >= 4)
                ]
                
                for _, row in user_books.iterrows():
                    book_id = row['book_id']
                    if book_id not in recommendations:
                        recommendations[book_id] = 0
                    recommendations[book_id] += row['rating']

            # Sort and return top recommendations
            sorted_recs = sorted(recommendations.items(), key=lambda x: x[1], reverse=True)
            return [
                {
                    'book_id': book_id,
                    'score': float(score),
                    'reason': f"Recommended based on similar users' preferences"
                }
                for book_id, score in sorted_recs[:n_recommendations]
            ]

        except Exception as e:
            logger.error(f"Error getting user recommendations: {str(e)}")
            return []

    def get_similar_books(
        self,
        book_id: int,
        n_recommendations: int = 10
    ) -> List[Dict[str, Any]]:
        """Get similar books based on content and user behavior."""
        try:
            if self.books_df is None:
                logger.warning("Books data not loaded")
                return []

            # Get book features
            book_features = self.books_df[self.books_df['book_id'] == book_id]
            if book_features.empty:
                logger.info(f"Book {book_id} not found in the dataset")
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
            logger.error(f"Error getting similar books: {str(e)}")
            return []

    def _get_similar_users(self, user_id: int, n_similar: int = 5) -> List[int]:
        """Get users with similar preferences."""
        try:
            if self.user_item_matrix is None:
                logger.warning("User-item matrix not loaded")
                return []

            # Get user's interaction vector
            user_vector = self.user_item_matrix[
                self.user_item_matrix['user_id'] == user_id
            ].drop(['user_id'], axis=1)

            if user_vector.empty:
                logger.info(f"No interaction data found for user {user_id}")
                return []

            # Calculate similarity with other users
            other_users = self.user_item_matrix[
                self.user_item_matrix['user_id'] != user_id
            ]
            similarities = cosine_similarity(
                user_vector,
                other_users.drop(['user_id'], axis=1)
            )[0]

            # Get top similar users
            similar_indices = np.argsort(similarities)[::-1][:n_similar]
            return other_users.iloc[similar_indices]['user_id'].tolist()

        except Exception as e:
            logger.error(f"Error getting similar users: {str(e)}")
            return [] 