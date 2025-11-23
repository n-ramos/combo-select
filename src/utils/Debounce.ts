/**
 * Utilitaire de debounce pour retarder l'exécution d'une fonction
 */

/**
 * Crée une fonction debounced qui retarde l'invocation de func jusqu'à ce que
 * delay millisecondes se soient écoulées depuis le dernier appel
 * 
 * @param func - La fonction à debouncer
 * @param delay - Le délai en millisecondes
 * @returns La fonction debouncée
 * 
 * @example
 * ```typescript
 * const searchUser = (query: string) => {
 *   console.log('Searching for:', query);
 * };
 * 
 * const debouncedSearch = debounce(searchUser, 300);
 * 
 * // N'exécutera searchUser qu'une seule fois après 300ms
 * debouncedSearch('john');
 * debouncedSearch('johnd');
 * debouncedSearch('johndoe'); // Seul celui-ci sera exécuté
 * ```
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number | null = null;

  return (...args: Parameters<T>): void => {
    // Annuler le timeout précédent si il existe
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Créer un nouveau timeout
    timeoutId = window.setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Crée une fonction debounced avec possibilité d'annulation
 * 
 * @param func - La fonction à debouncer
 * @param delay - Le délai en millisecondes
 * @returns Un objet avec la fonction debouncée et une méthode cancel
 * 
 * @example
 * ```typescript
 * const { debounced, cancel } = createDebouncedFunction(
 *   (query: string) => console.log(query),
 *   300
 * );
 * 
 * debounced('hello');
 * 
 * // Annuler l'exécution en attente
 * cancel();
 * ```
 */
export function createDebouncedFunction<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): {
  debounced: (...args: Parameters<T>) => void;
  cancel: () => void;
} {
  let timeoutId: number | null = null;

  const debounced = (...args: Parameters<T>): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };

  const cancel = (): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return { debounced, cancel };
}

/**
 * Crée une fonction throttled qui n'invoque func qu'au maximum une fois par période
 * 
 * @param func - La fonction à throttler
 * @param limit - La période minimale entre les appels en millisecondes
 * @returns La fonction throttlée
 * 
 * @example
 * ```typescript
 * const handleScroll = () => {
 *   console.log('Scrolling...');
 * };
 * 
 * const throttledScroll = throttle(handleScroll, 200);
 * 
 * window.addEventListener('scroll', throttledScroll);
 * // handleScroll sera appelé au maximum une fois toutes les 200ms
 * ```
 */
export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>): void => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}