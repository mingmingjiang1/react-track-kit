import { useMount, useUnmount } from "ahooks";
import { Dispatcher } from "../tools/dispatcher";
import { ReactNode, useCallback } from "react";

export type TrackPageVisibleProps<P, E> = {
  cls: string;
  extra?: E;
  children?: ReactNode;
  params?: P;
  path?: string[];
  token?: symbol;
};

export const PageActiveChange = <P, E>({
  path = ['handleHidden', 'handleVisible'],
  cls,
  params,
  extra,
  children,
}: TrackPageVisibleProps<P, E>) => {
  const _instance = Dispatcher.getInstance();

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      // if doc hidden do ?
      _instance.dispatch(cls, path?.[0], params || {}, extra || {});
    } else {
      // if doc visible do ?
      _instance.dispatch(cls, path?.[1], params || {}, extra || {});
    }
  }, []);

  useMount(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  });

  useUnmount(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  });

  return children;
};