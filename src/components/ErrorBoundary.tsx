import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home, Copy, Check } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  componentStack: string | null;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    componentStack: null,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ componentStack: errorInfo.componentStack || null });
  }

  private getDiagnosticText = (): string => {
    const { error, componentStack } = this.state;
    const lines = [
      `Erro: ${error?.name || 'Unknown'}: ${error?.message || '(sem mensagem)'}`,
      navigator?.userAgent ? `Navegador: ${navigator.userAgent}` : '',
      error?.stack ? `\nStack:\n${error.stack}` : '',
      componentStack ? `\nComponente:${componentStack}` : '',
    ];
    return lines.filter(Boolean).join('\n');
  };

  private handleCopyDiagnostics = async () => {
    try {
      await navigator.clipboard.writeText(this.getDiagnosticText());
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    } catch {}
  };

  private handleReload = () => {
    try {
      window.location.reload();
    } catch {
      window.location.href = '/';
    }
  };

  private handleClearAndReset = () => {
    // Wipe everything the app persists client-side, in case corrupted cached
    // data (not just favorites/theme) is what's triggering the crash.
    try {
      localStorage.removeItem('cerrado_favorites');
      localStorage.removeItem('theme');
      localStorage.removeItem('admin_authenticated');
      localStorage.removeItem('cerrado_stays_properties_prod_v1');
      localStorage.removeItem('cerrado_stays_properties_prod_v1_tmp');
      localStorage.removeItem('cerrado_stays_properties_prod_v1_backup');
      localStorage.removeItem('cerrado_stays_unavailabilities_prod_v1');
      localStorage.removeItem('cerrado_stays_unavailabilities_prod_v1_backup');
      localStorage.removeItem('cerrado_google_sheets_config_v1');
    } catch {}
    try {
      indexedDB.deleteDatabase('CerradoStaysDB_v2');
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

            {/* Technical detail, shown so a screenshot of this screen is enough to diagnose the bug */}
            <div className="pt-3 border-t border-neutral-100 text-left">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Detalhe técnico
                </span>
                <button
                  type="button"
                  onClick={this.handleCopyDiagnostics}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-neutral-500 hover:text-neutral-800 cursor-pointer"
                >
                  {this.state.copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{this.state.copied ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
              <pre className="text-[10px] leading-relaxed text-neutral-500 bg-neutral-50 border border-neutral-100 rounded-lg p-2.5 max-h-32 overflow-auto whitespace-pre-wrap break-words">
                {this.state.error?.name}: {this.state.error?.message || '(sem mensagem)'}
              </pre>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
