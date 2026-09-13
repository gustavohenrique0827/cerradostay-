import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  private handleReload = () => {
    try {
      window.location.reload();
    } catch {
      window.location.href = '/';
    }
  };

  private handleClearAndReset = () => {
    try {
      localStorage.removeItem('cerrado_favorites');
      localStorage.removeItem('theme');
    } catch {}
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F7F5] flex items-center justify-center p-4 font-sans text-[#002147]">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-[#DEE2E6] text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-[#C5A059] flex items-center justify-center mx-auto border border-[#C5A059]/20">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-neutral-900">
                Ocorreu uma instabilidade
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                Detectamos uma atualização ou erro de carregamento no seu dispositivo. Não se preocupe, seus dados estão protegidos.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 bg-[#C5A059] hover:bg-[#A68648] text-white py-3.5 px-5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer touch-manipulation"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Recarregar</span>
              </button>

              <button
                type="button"
                onClick={this.handleClearAndReset}
                className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 py-3.5 px-5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer touch-manipulation"
              >
                <Home className="w-4 h-4" />
                <span>Início</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
