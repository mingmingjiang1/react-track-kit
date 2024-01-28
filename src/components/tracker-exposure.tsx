import { ReactNode, useEffect, useRef } from "react";
import { Dispatcher } from "../tools/dispatcher";

export type TrackExposureProps<P, E> = {
  cls: string;
  extra?: E;
  children?: ReactNode;
  params?: P;
  path: string;
  token?: symbol;
};


export const TrackExposure = ({
  cls,
  path,
  params,
  extra,
  children,
}: {
  cls;
  path;
  extra?: IMutableObject;
  params;
  children;
}) => {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      const _instance = Dispatcher.getInstance();

      _instance.dispatch(cls, path, params || {}, extra || {});
    }
  }, [ref, path, params]);

  return children({ ref });
};

export const TrackExposureV2 = <P, E>({
  cls,
  path,
  extra,
  params,
  children,
}: TrackExposureProps<P, E>) => {
  useEffect(() => {
    const _instance = Dispatcher.getInstance();

    _instance.dispatch(cls, path, params || {}, extra || {});
  }, []);

  return children;
};