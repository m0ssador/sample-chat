import { useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setActiveChatId } from '@/store/chatSlice';
import { selectChats } from '@/store/selectors';

/**
 * Синхронизирует Redux (activeChatId) с маршрутом: `/` — нет активного чата,
 * `/chat/:id` — чат с данным id или редирект на `/`, если id невалиден или чата нет.
 */
export function useChatRouteSync(): void {
  const params = useParams<{ chatId?: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const chats = useAppSelector(selectChats);
  const chatIdParam = params.chatId;

  useEffect(() => {
    if (pathname === '/') {
      dispatch(setActiveChatId(null));
      return;
    }

    if (chatIdParam === undefined) {
      return;
    }

    const id = Number.parseInt(chatIdParam, 10);
    if (Number.isNaN(id)) {
      router.replace('/');
      return;
    }

    const exists = chats.some((c) => c.id === id);
    if (!exists) {
      router.replace('/');
      return;
    }

    dispatch(setActiveChatId(id));
  }, [pathname, chatIdParam, chats, dispatch, router]);
}
