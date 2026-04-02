import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setActiveChatId } from '../store/chatSlice';
import { selectChats } from '../store/selectors';

/**
 * Синхронизирует Redux (activeChatId) с маршрутом: `/` — нет активного чата,
 * `/chat/:id` — чат с данным id или редирект на `/`, если id невалиден или чата нет.
 */
export function useChatRouteSync(): void {
  const { chatId: chatIdParam } = useParams<{ chatId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const chats = useAppSelector(selectChats);

  useEffect(() => {
    if (location.pathname === '/') {
      dispatch(setActiveChatId(null));
      return;
    }

    if (chatIdParam === undefined) {
      return;
    }

    const id = Number.parseInt(chatIdParam, 10);
    if (Number.isNaN(id)) {
      navigate('/', { replace: true });
      return;
    }

    const exists = chats.some((c) => c.id === id);
    if (!exists) {
      navigate('/', { replace: true });
      return;
    }

    dispatch(setActiveChatId(id));
  }, [location.pathname, chatIdParam, chats, dispatch, navigate]);
}
