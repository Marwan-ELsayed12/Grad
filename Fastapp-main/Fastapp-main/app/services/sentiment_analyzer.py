from typing import Dict, Any, List, Tuple
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import numpy as np
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

class SentimentAnalyzer:
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.load_model()

    def load_model(self) -> None:
        """Load the RoBERTa model and tokenizer."""
        try:
            model_path = Path("ml_models/roberta_model")
            if not model_path.exists():
                logger.warning("RoBERTa model not found. Using default sentiment analysis.")
                return

            self.tokenizer = AutoTokenizer.from_pretrained(model_path)
            self.model = AutoModelForSequenceClassification.from_pretrained(model_path)
            self.model.to(self.device)
            logger.info("Successfully loaded RoBERTa model")
        except Exception as e:
            logger.error(f"Error loading RoBERTa model: {str(e)}")
            raise

    def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Analyze the sentiment of a given text using RoBERTa."""
        try:
            if not self.model or not self.tokenizer:
                return self._default_sentiment_analysis(text)

            # Tokenize and prepare input
            inputs = self.tokenizer(
                text,
                return_tensors="pt",
                truncation=True,
                max_length=512,
                padding=True
            ).to(self.device)

            # Get model predictions
            with torch.no_grad():
                outputs = self.model(**inputs)
                predictions = torch.softmax(outputs.logits, dim=1)
                sentiment_scores = predictions.cpu().numpy()[0]

            # Map scores to sentiment labels
            sentiment_labels = ["negative", "neutral", "positive"]
            sentiment = sentiment_labels[np.argmax(sentiment_scores)]
            confidence = float(np.max(sentiment_scores))

            return {
                "sentiment": sentiment,
                "confidence": confidence,
                "scores": {
                    label: float(score)
                    for label, score in zip(sentiment_labels, sentiment_scores)
                }
            }
        except Exception as e:
            logger.error(f"Error analyzing sentiment: {str(e)}")
            return self._default_sentiment_analysis(text)

    def analyze_batch(self, texts: List[str]) -> List[Dict[str, Any]]:
        """Analyze sentiment for a batch of texts."""
        return [self.analyze_sentiment(text) for text in texts]

    def _default_sentiment_analysis(self, text: str) -> Dict[str, Any]:
        """Fallback sentiment analysis when RoBERTa model is not available."""
        # Simple rule-based sentiment analysis
        positive_words = {"good", "great", "excellent", "amazing", "wonderful", "love", "enjoy"}
        negative_words = {"bad", "poor", "terrible", "awful", "hate", "dislike", "worst"}

        words = text.lower().split()
        positive_count = sum(1 for word in words if word in positive_words)
        negative_count = sum(1 for word in words if word in negative_words)

        if positive_count > negative_count:
            sentiment = "positive"
            confidence = 0.7
        elif negative_count > positive_count:
            sentiment = "negative"
            confidence = 0.7
        else:
            sentiment = "neutral"
            confidence = 0.5

        return {
            "sentiment": sentiment,
            "confidence": confidence,
            "scores": {
                "positive": 0.33,
                "neutral": 0.34,
                "negative": 0.33
            }
        }

    def get_sentiment_interpretation(self, score: float) -> str:
        """
        Convert a sentiment score to a human-readable interpretation.
        """
        if score >= 0.5:
            return "Very Positive"
        elif score >= 0.1:
            return "Positive"
        elif score >= -0.1:
            return "Neutral"
        elif score >= -0.5:
            return "Negative"
        else:
            return "Very Negative"
    
    def analyze_reviews(self, reviews: List[Tuple[int, str, str]]) -> List[Dict]:
        """
        Analyze a list of reviews and return sentiment analysis results.
        Each review should be a tuple of (review_id, book_title, review_text).
        """
        results = []
        for review_id, book_title, text in reviews:
            if not text:
                continue
            
            sentiment = self.analyze_sentiment(text)
            interpretation = self.get_sentiment_interpretation(sentiment["confidence"])
            
            results.append({
                "review_id": review_id,
                "book_title": book_title,
                "sentiment": sentiment["sentiment"],
                "confidence": sentiment["confidence"],
                "scores": sentiment["scores"],
                "interpretation": interpretation
            })
        
        return results
    
    def get_sentiment_stats(self, reviews: List[Dict]) -> Dict:
        """
        Calculate sentiment statistics from a list of review analysis results.
        """
        if not reviews:
            return {
                "total_reviews": 0,
                "reviews_with_comments": 0,
                "average_confidence": 0,
                "sentiment_stats": {
                    "Very Positive": 0,
                    "Positive": 0,
                    "Neutral": 0,
                    "Negative": 0,
                    "Very Negative": 0
                },
                "interpretation": "No reviews available"
            }
        
        sentiments = [r["confidence"] for r in reviews]
        interpretations = [r["interpretation"] for r in reviews]
        
        # Calculate statistics
        avg_confidence = np.mean(sentiments)
        sentiment_stats = {
            "Very Positive": interpretations.count("Very Positive"),
            "Positive": interpretations.count("Positive"),
            "Neutral": interpretations.count("Neutral"),
            "Negative": interpretations.count("Negative"),
            "Very Negative": interpretations.count("Very Negative")
        }
        
        # Generate interpretation
        if avg_confidence >= 0.5:
            interpretation = "Overall very positive sentiment"
        elif avg_confidence >= 0.1:
            interpretation = "Overall positive sentiment"
        elif avg_confidence >= -0.1:
            interpretation = "Overall neutral sentiment"
        elif avg_confidence >= -0.5:
            interpretation = "Overall negative sentiment"
        else:
            interpretation = "Overall very negative sentiment"
        
        return {
            "total_reviews": len(reviews),
            "reviews_with_comments": len([r for r in reviews if r["confidence"] != 0]),
            "average_confidence": float(avg_confidence),
            "sentiment_stats": sentiment_stats,
            "interpretation": interpretation
        } 