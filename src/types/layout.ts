import { NextPage } from "next";
import { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";

export type TNextPageWithLayout<T extends object = {}> = NextPage<
  T & { connection: any }
> & {
  breadcrumb?: string;
  Layout: TlayoutWithChild;
  isBreadcrumb?: any;
};

export type TNextPageWithSubLayout = NextPage & {
  getLayout: (page: ReactElement) => ReactNode;
};
export type TlayoutWithChild = {
  getLayout: (page: ReactElement) => ReactNode;
};

export type TAppPropsWithLayout = AppProps & {
  Component: TNextPageWithLayout;
};
