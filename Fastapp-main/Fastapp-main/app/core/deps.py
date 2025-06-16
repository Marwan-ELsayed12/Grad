from app.db.deps import get_db
from app.core.auth import get_current_user, get_current_active_superuser

# Alias for backward compatibility
get_current_superuser = get_current_active_superuser

__all__ = ['get_db', 'get_current_user', 'get_current_superuser'] 