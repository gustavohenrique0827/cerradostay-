import { Property, PropertyUnavailability } from '../types';
import { 
  exportPropertiesBackup, 
  importPropertiesBackup, 
  getUnavailabilities 
} from './dataService';

export interface FullSystemBackupData {
  version: string;
  createdAt: string;
  system: string;
  propertiesCount: number;
  unavailabilitiesCount: number;
  properties: Property[];
  unavailabilities: PropertyUnavailability[];
}

const PRIMARY_UNAVAILABILITIES_KEY = 'cerrado_stays_unavailabilities_prod_v1';

/**
 * Gera e faz download do backup integral do sistema (todos os imóveis e bloqueios).
 */
export async function downloadFullSystemBackup(
  properties: Property[],
  unavailabilities: PropertyUnavailability[]
): Promise<void> {
  const backupData: FullSystemBackupData = {
    version: '2.0.0',
    createdAt: new Date().toISOString(),
    system: 'Cerrado Stay Palmas',
    propertiesCount: properties.length,
    unavailabilitiesCount: unavailabilities.length,
    properties,
    unavailabilities,
  };

  const jsonString = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const todayStr = new Date().toISOString().split('T')[0];
  a.download = `cerrado_stay_backup_completo_${todayStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Restaura o sistema completo a partir de um arquivo JSON de backup.
 */
export async function restoreFullSystemBackup(
  jsonContent: string
): Promise<{ success: boolean; propertiesCount?: number; unavailabilitiesCount?: number; error?: string }> {
  try {
    const data = JSON.parse(jsonContent);

    // Caso seja backup antigo (apenas array de properties)
    if (Array.isArray(data)) {
      const result = importPropertiesBackup(jsonContent);
      return {
        success: result.success,
        propertiesCount: result.count,
        unavailabilitiesCount: 0,
        error: result.error,
      };
    }

    // Caso seja o backup completo FullSystemBackupData
    if (data && Array.isArray(data.properties)) {
      const propResult = importPropertiesBackup(JSON.stringify(data.properties));
      if (!propResult.success) {
        return { success: false, error: propResult.error };
      }

      if (Array.isArray(data.unavailabilities)) {
        try {
          localStorage.setItem(PRIMARY_UNAVAILABILITIES_KEY, JSON.stringify(data.unavailabilities));
        } catch (e) {
          console.warn('Erro ao salvar unavailabilities no restore:', e);
        }
      }

      // Disparar evento para recarregar componentes
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cerrado_stays_properties_updated'));
      }

      return {
        success: true,
        propertiesCount: propResult.count,
        unavailabilitiesCount: Array.isArray(data.unavailabilities) ? data.unavailabilities.length : 0,
      };
    }

    return { success: false, error: 'Formato do arquivo de backup não reconhecido.' };
  } catch (err: any) {
    return { success: false, error: `Falha ao ler arquivo: ${err?.message || 'Arquivo corrompido'}` };
  }
}
