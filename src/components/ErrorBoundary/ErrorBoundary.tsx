'use client';

import React, { type ErrorInfo, type ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Заголовок блока при ошибке (для контекста UI). */
  title?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'Неизвестная ошибка',
    };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo): void {
    /* Сообщение пользователю — в state; при необходимости сюда можно добавить Sentry и т.п. */
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, message: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className={styles.panel} role="alert">
          <p className={styles.title}>
            {this.props.title ?? 'Что-то пошло не так при отображении.'}
          </p>
          {this.state.message ? (
            <p className={styles.detail}>{this.state.message}</p>
          ) : null}
          <button type="button" className={styles.retry} onClick={this.handleRetry}>
            Повторить
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
