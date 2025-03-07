/* eslint-disable import/order */
/**
 * Interaction module for Calendar Card Pro
 *
 * Implements Material Design-inspired interactions with proper state management
 * and device-appropriate behavior based on Home Assistant Tile Card patterns.
 *
 * Interaction patterns inspired by Home Assistant's Tile Card
 * and Material Design, both licensed under the Apache License 2.0.
 * https://github.com/home-assistant/frontend/blob/dev/LICENSE.md
 */

import * as Types from '../config/types';
import * as Logger from './logger-utils';

/**
 * Extract primary entity ID from entities configuration
 */
export function getPrimaryEntityId(
  entities: Array<string | { entity: string; color?: string }>,
): string {
  const firstEntity = entities[0];
  return typeof firstEntity === 'string' ? firstEntity : firstEntity.entity;
}

/**
 * Handle action based on configuration
 * Full implementation following HA Tile Card patterns
 *
 * @param actionConfig - Action configuration
 * @param hass - Home Assistant instance
 * @param element - DOM element generating the action
 * @param entityId - Primary entity ID
 * @param toggleExpanded - Function to toggle expanded state
 */
export function handleAction(
  actionConfig: Types.ActionConfig,
  hass: Types.Hass | null,
  element: Element,
  entityId: string,
  toggleExpanded: () => void,
): void {
  // Validate input to prevent errors
  if (!actionConfig || !actionConfig.action || actionConfig.action === 'none') {
    Logger.debug('No action or action set to none - ignoring');
    return;
  }

  Logger.info(`Executing action: ${actionConfig.action}`);

  // Specific, typed actions with proper error handling
  try {
    switch (actionConfig.action) {
      case 'more-info':
        fireMoreInfo(element, entityId);
        break;

      case 'navigate':
        handleNavigation(actionConfig);
        break;

      case 'call-service':
        if (hass) {
          callService(hass, actionConfig);
        } else {
          Logger.warn('Cannot call service - hass object not available');
        }
        break;

      case 'url':
        openUrl(actionConfig);
        break;

      case 'expand':
        toggleExpanded();
        break;

      default:
        Logger.warn(`Unknown action type: ${actionConfig.action}`);
    }
  } catch (error) {
    // Ensure errors in actions don't crash the card
    Logger.error(`Error executing action ${actionConfig.action}:`, error);
  }
}

/**
 * Fire a Home Assistant more-info event
 * Full implementation following HA patterns
 *
 * @param element - DOM element generating the event
 * @param entityId - Entity ID to show info about
 */
export function fireMoreInfo(element: Element, entityId: string): void {
  if (!entityId) {
    Logger.warn('Cannot show more-info - no entity ID provided');
    return;
  }

  Logger.info(`Firing more-info for entity: ${entityId}`);

  try {
    // Create a new custom event with proper bubbling
    const event = new CustomEvent('hass-more-info', {
      detail: { entityId },
      bubbles: true,
      composed: true, // Important for crossing shadow DOM boundaries
      cancelable: false,
    });

    element.dispatchEvent(event);
  } catch (error) {
    Logger.error('Error firing more-info event:', error);
  }
}

/**
 * Handle navigation action with improved error handling
 *
 * @param actionConfig - Action configuration
 */
export function handleNavigation(actionConfig: Types.ActionConfig): void {
  if (!actionConfig.navigation_path) {
    Logger.warn('Cannot navigate - no navigation path provided');
    return;
  }

  Logger.info(`Navigating to: ${actionConfig.navigation_path}`);

  try {
    // Navigate using history API
    window.history.pushState(null, '', actionConfig.navigation_path);

    // Dispatch event for Home Assistant to detect navigation
    const locationChangedEvent = new Event('location-changed', {
      bubbles: true,
      cancelable: false,
    });
    window.dispatchEvent(locationChangedEvent);
  } catch (error) {
    Logger.error('Error during navigation:', error);
  }
}

/**
 * Call a Home Assistant service with improved validation and error handling
 *
 * @param hass - Home Assistant instance
 * @param actionConfig - Action configuration
 */
export function callService(hass: Types.Hass, actionConfig: Types.ActionConfig): void {
  if (!actionConfig.service) {
    Logger.warn('Cannot call service - no service specified');
    return;
  }

  const serviceParts = actionConfig.service.split('.');
  if (serviceParts.length !== 2) {
    Logger.error(`Invalid service format: ${actionConfig.service} - must be domain.service`);
    return;
  }

  const [domain, service] = serviceParts;
  const serviceData = actionConfig.service_data || {};

  Logger.info(`Calling service ${domain}.${service}`, serviceData);

  try {
    hass.callService(domain, service, serviceData);
  } catch (error) {
    Logger.error(`Error calling service ${domain}.${service}:`, error);
  }
}

/**
 * Open a URL with security validation
 *
 * @param actionConfig - Action configuration
 */
export function openUrl(actionConfig: Types.ActionConfig): void {
  if (!actionConfig.url_path) {
    Logger.warn('Cannot open URL - no URL path provided');
    return;
  }

  Logger.info(`Opening URL: ${actionConfig.url_path}`);

  try {
    // Security check - must be http/https URL or relative path
    let url = actionConfig.url_path;
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
      Logger.warn(`Potentially unsafe URL: ${url} - adding https://`);
      url = 'https://' + url;
    }

    // Open URL in new tab with security best practices
    const newTab = window.open(url, '_blank');
    if (newTab) {
      newTab.opener = null; // Remove reference to opener for security
    }
  } catch (error) {
    Logger.error('Error opening URL:', error);
  }
}

/**
 * Create interaction styles element with all necessary CSS
 * Following exact specifications from HA Tile Card reference
 *
 * @returns Style element with interaction styles
 */
export function createInteractionStyles(): HTMLStyleElement {
  const layeredStyles = document.createElement('style');
  layeredStyles.id = 'calendar-card-interaction-styles';

  // Update style definition with enhanced performance optimizations
  layeredStyles.textContent = `
    /* Base container */
    .card-container {
      position: relative;
      background: transparent !important; /* Keep container transparent */
      overflow: visible; /* Allow hover effect to extend outside */
      cursor: pointer;
      transition: transform 180ms ease-in-out;
      will-change: transform; /* Hint for browser to use GPU */
      transform: translateZ(0); /* Force GPU acceleration */
      -webkit-backface-visibility: hidden; /* Prevent flickering on Safari */
    }

    /* Background layer - Add compositing hint */
    .card-bg-layer {
      position: absolute;
      inset: 0;
      z-index: 1 !important;
      background-color: var(--ha-card-background, var(--card-background-color, white));
      border-radius: var(--ha-card-border-radius, 4px);
      transform: translateZ(0); /* Force compositing layer */
    }

    /* Content layer - EXPLICIT TRANSPARENCY */
    .card-content-layer {
      position: relative;
      z-index: 3 !important;
      background: transparent !important; /* Force transparency */
      transform: translateZ(0.1px); /* Small offset to ensure proper stacking */
      will-change: transform; /* Hint for browser to use GPU */
    }

    /* Ripple container - Enhanced performance */
    .card-ripple-container {
      position: absolute;
      inset: 0;
      z-index: 2 !important; /* Between bg (1) and content (3) */
      pointer-events: none;
      overflow: hidden;
      border-radius: var(--ha-card-border-radius, 4px);
      will-change: transform; /* Performance optimization */
      transform: translateZ(0.05px); /* Very small offset to ensure proper layer */
    }
    
    /* Force transparency for all child elements that might have backgrounds */
    .card-content-layer > * {
      background-color: transparent !important;
    }

    /* Individual ripple - REFINED ANIMATION */
    .card-ripple {
      position: absolute;
      border-radius: 50%;
      background-color: var(--card-accent-color);
      opacity: 0;
      transform: translate(-50%, -50%) scale(0);
      pointer-events: none;
      will-change: transform, opacity;
      transition: opacity 300ms linear, transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
      backface-visibility: hidden; /* Prevent flickering */
      perspective: 1000px; /* Additional performance boost */
    }

    /* Hold indicator - ENHANCED ANIMATION */
    .card-hold-indicator {
      position: fixed;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: var(--card-accent-color);
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.9); /* Start slightly smaller */
      pointer-events: none;
      will-change: transform, opacity;
      transition: opacity 150ms ease-in-out, transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 9999;
      backface-visibility: hidden; /* Prevent flickering */
    }
    
    /* Touch devices - bigger hold indicator */
    @media (pointer: coarse) {
      .card-hold-indicator {
        width: 48px;
        height: 48px;
      }
    }

    /* Hover effect - REFINED TRANSITION */
    @media (hover: hover) {
      .card-container:hover::before {
        content: "";
        position: absolute;
        inset: 0;
        background: var(--card-accent-color);
        opacity: 0.05;
        z-index: 2;
        border-radius: var(--ha-card-border-radius, 4px);
        pointer-events: none;
        transition: opacity 180ms ease-in-out; /* Match container transition */
        will-change: opacity; /* Performance optimization */
      }
    }
  `;

  return layeredStyles;
}

/**
 * Create the three-layer DOM structure required for interactions
 *
 * @returns Object containing the container and layer elements
 */
export function createInteractionDom(): {
  container: HTMLDivElement;
  bgLayer: HTMLDivElement;
  rippleContainer: HTMLDivElement;
  contentLayer: HTMLDivElement;
} {
  // Create layered container structure
  const container = document.createElement('div');
  container.className = 'card-container';

  // Create and add background layer
  const bgLayer = document.createElement('div');
  bgLayer.className = 'card-bg-layer';
  container.appendChild(bgLayer);

  // Create ripple container
  const rippleContainer = document.createElement('div');
  rippleContainer.className = 'card-ripple-container';
  container.appendChild(rippleContainer);

  // Create content layer
  const contentLayer = document.createElement('div');
  contentLayer.className = 'card-content-layer';
  container.appendChild(contentLayer);

  return { container, bgLayer, rippleContainer, contentLayer };
}

/**
 * Move existing content into the content layer of the three-layer structure
 * Ensures all content has transparent background while preserving styles
 *
 * @param sourceContainer - Original container with content
 * @param contentLayer - Target content layer
 */
export function moveContentToLayer(sourceContainer: HTMLElement, contentLayer: HTMLElement): void {
  if (!(sourceContainer instanceof HTMLElement)) return;

  // Copy padding from original container
  const containerStyles = window.getComputedStyle(sourceContainer);
  contentLayer.style.padding = containerStyles.padding;
  contentLayer.style.backgroundColor = 'transparent'; // Force transparency

  // Move all children to content layer
  while (sourceContainer.firstChild) {
    const child = sourceContainer.firstChild;
    if (child instanceof HTMLElement) {
      // Remove any background from child elements
      child.style.backgroundColor = 'transparent';
    }
    contentLayer.appendChild(child);
  }
}

/**
 * Set up layered DOM structure for interactions
 * This is an enhanced version of the stub that actually implements the functionality
 *
 * @param container - The container element to convert to a layered structure
 * @returns Object containing the created layers
 */
export function setupInteractionDom(container: HTMLElement): {
  bgLayer: HTMLElement;
  rippleContainer: HTMLElement;
  contentLayer: HTMLElement;
} {
  Logger.info('Setting up interaction DOM structure');

  // First, ensure the container has position relative and transparent background
  if (window.getComputedStyle(container).position === 'static') {
    container.style.position = 'relative';
  }
  container.style.background = 'transparent';
  container.style.overflow = 'visible'; // Allow hover effect to extend outside
  container.classList.add('card-container');

  // Create background layer
  const bgLayer = document.createElement('div');
  bgLayer.className = 'card-bg-layer';

  // Create ripple container
  const rippleContainer = document.createElement('div');
  rippleContainer.className = 'card-ripple-container';

  // Create content layer
  const contentLayer = document.createElement('div');
  contentLayer.className = 'card-content-layer';

  // Store existing children
  const existingContent = Array.from(container.children);

  // Insert new layers
  container.appendChild(bgLayer);
  container.appendChild(rippleContainer);
  container.appendChild(contentLayer);

  // Move existing content to content layer
  existingContent.forEach((child) => {
    if (child instanceof HTMLElement) {
      child.style.backgroundColor = 'transparent';
    }
    contentLayer.appendChild(child);
  });

  return { bgLayer, rippleContainer, contentLayer };
}

/**
 * Set up ripple effects for an element
 * Uses the new DOM-based ripple implementation
 *
 * @param container - Container element
 * @param rippleContainer - Container for ripple effects
 * @returns Cleanup function to remove event listeners
 */
export function setupRippleEffects(
  container: HTMLElement,
  rippleContainer: HTMLElement,
): () => void {
  Logger.info('Setting up ripple effects');

  // Clean up existing handler if it exists
  if (container._rippleHandler) {
    container.removeEventListener('pointerdown', container._rippleHandler);
    delete container._rippleHandler;
  }

  // Create new handler for ripple creation that checks state first
  container._rippleHandler = (ev: PointerEvent) => {
    Logger.debug('Ripple handler triggered', {
      pointerId: ev.pointerId,
      time: new Date().toISOString(),
    });

    // Create the ripple effect in the ripple container
    const ripple = createRippleEffect(ev, rippleContainer);

    // Clean up ripple after animation
    setTimeout(() => {
      removeRippleEffect(ripple);
    }, 300);
  };

  // Attach the handler
  container.addEventListener('pointerdown', container._rippleHandler);

  // Return cleanup function
  return () => {
    if (container._rippleHandler) {
      container.removeEventListener('pointerdown', container._rippleHandler);
      delete container._rippleHandler;
    }
  };
}

/**
 * Create and animate a ripple effect at the specified position
 * Follows exact specifications from HA Tile Card (v2025.3)
 * Enhanced with smoother animation transition
 *
 * @param event - Pointer event that triggered the ripple
 * @param rippleContainer - Container element to add the ripple to
 * @returns The created ripple element
 */
export function createRippleEffect(event: PointerEvent, rippleContainer: HTMLElement): HTMLElement {
  Logger.info('Creating ripple effect', {
    x: event.clientX,
    y: event.clientY,
    container: rippleContainer.className,
  });

  // Get container dimensions for proper sizing
  const rect = rippleContainer.getBoundingClientRect();

  // Calculate position relative to container
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Size ripple to ensure it covers the entire container (2.5x size)
  const size = Math.max(rect.width, rect.height) * 2.5;

  // Create ripple element with proper initial styling
  const ripple = document.createElement('div');
  ripple.className = 'card-ripple';

  // No need to set background-color here as it's defined in the CSS
  // The element will inherit the background-color from the class

  // Position and size the ripple
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  // Set initial state (invisible and scaled to zero)
  ripple.style.opacity = '0';
  ripple.style.transform = 'translate(-50%, -50%) scale(0)';

  // Add to container
  rippleContainer.appendChild(ripple);

  // Force a reflow before animation starts to ensure smooth transition
  // This prevents the browser from batching the creation and animation
  ripple.offsetWidth; // eslint-disable-line no-unused-expressions

  // Use requestAnimationFrame for smoother animation start
  requestAnimationFrame(() => {
    // Trigger animation with exact specs from HA Tile Card
    ripple.style.opacity = '0.12'; // Confirmed exact opacity per HA specs
    ripple.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  return ripple;
}

/**
 * Remove ripple effect with proper animation
 *
 * @param ripple - Ripple element to remove
 * @param delay - Optional delay before starting fade-out animation (default: 0ms)
 */
export function removeRippleEffect(ripple: HTMLElement, delay = 0): void {
  if (!ripple || !ripple.parentNode) return;

  // If delay specified, wait before starting fade-out
  setTimeout(() => {
    // Start fade-out animation
    ripple.style.opacity = '0'; // This maintains the 300ms linear transition from CSS

    // Remove from DOM after animation completes (300ms per specs)
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 300); // Exact match to transition duration
  }, delay);
}

/**
 * Create hold indicator that appears after hold threshold (500ms)
 * Uses exact specifications from HA Tile Card
 * Enhanced with smoother animation and transition from ripple effect
 *
 * @param event - Pointer event that triggered the hold
 * @returns The created hold indicator element
 */
export function createHoldIndicator(event: PointerEvent): HTMLElement {
  Logger.info('Creating hold indicator', {
    x: event.clientX,
    y: event.clientY,
  });

  // Create hold indicator element with correct class
  const indicator = document.createElement('div');
  indicator.className = 'card-hold-indicator';

  // No need to set background-color here as it's defined in the CSS
  // The element will inherit the background-color from the class

  // Position the indicator at exact pointer coordinates (viewport-relative)
  indicator.style.left = `${event.clientX}px`;
  indicator.style.top = `${event.clientY}px`;

  // Set exact initial state (invisible and slightly smaller)
  indicator.style.opacity = '0';
  indicator.style.transform = 'translate(-50%, -50%) scale(0.9)';

  // Size the indicator differently based on device type per HA specs
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  indicator.style.width = isTouchDevice ? '48px' : '32px';
  indicator.style.height = isTouchDevice ? '48px' : '32px';

  // DEBUGGING: Add data attribute to help identify potential orphaned indicators
  indicator.dataset.createdAt = Date.now().toString();

  // Add to document body (not the ripple container)
  document.body.appendChild(indicator);

  // Force a reflow before animation starts to ensure smooth transition
  indicator.offsetWidth; // eslint-disable-line no-unused-expressions

  // Trigger appear animation with exact specs
  requestAnimationFrame(() => {
    indicator.style.opacity = '0.28'; // Confirmed exact opacity from HA specs
    indicator.style.transform = 'translate(-50%, -50%) scale(1)'; // Scale to full size
  });

  return indicator;
}

/**
 * Remove hold indicator with proper animation
 * Enhanced with smoother exit animation
 *
 * @param indicator - Hold indicator element to remove
 */
export function removeHoldIndicator(indicator: HTMLElement): void {
  if (!indicator || !indicator.parentNode) return;

  // Start fade-out animation with transform for smoother effect
  indicator.style.opacity = '0';
  indicator.style.transform = 'translate(-50%, -50%) scale(0.9)';

  // Remove from DOM after animation completes
  setTimeout(() => {
    if (indicator.parentNode) {
      indicator.parentNode.removeChild(indicator);
    }
  }, 300); // Matches HA specs for fade-out duration
}

/**
 * Interface for interaction state
 * Ensures consistent state management across interaction lifecycle
 */
interface InteractionState {
  instanceId: string; // Add unique instance identifier
  holdTimer: number | null;
  holdTriggered: boolean;
  holdIndicator: HTMLElement | null; // Added to track hold indicator
  activePointerId: number | null;
  lastActionTime: number;
  pendingHoldAction: boolean; // Added to track hold action state
}

/**
 * Set up complete interactions for a card element
 */
export function setupInteractions(
  element: HTMLElement,
  config: Types.Config,
  hass: Types.Hass | null,
  entityId: string,
  toggleExpanded: () => void,
): () => void {
  // Generate a unique instance ID for this specific setup
  const instanceId = `interaction_${Math.random().toString(36).substr(2, 9)}`;
  Logger.debug(`Creating interaction setup with ID: ${instanceId}`);

  // Early return if no actions configured
  if (
    (!config.tap_action || config.tap_action.action === 'none') &&
    (!config.hold_action || config.hold_action.action === 'none')
  ) {
    return () => {}; // Return no-op cleanup function
  }

  // Find or create required DOM elements
  const rippleContainer = element.querySelector('.card-ripple-container') as HTMLElement;

  if (!rippleContainer) {
    Logger.warn('Cannot set up interactions - missing ripple container');
    return () => {};
  }

  // Track all ripples created for proper cleanup
  let activeRipples: HTMLElement[] = [];

  // Function to completely clear the ripple container
  const clearRippleContainer = () => {
    if (rippleContainer) {
      // Remove all children from ripple container
      while (rippleContainer.firstChild) {
        rippleContainer.removeChild(rippleContainer.firstChild);
      }
      activeRipples = [];
    }
  };

  // Factory function to create a fresh state object
  const createFreshState = (): InteractionState => ({
    instanceId,
    holdTimer: null,
    holdTriggered: false,
    holdIndicator: null,
    activePointerId: null,
    lastActionTime: 0,
    pendingHoldAction: false,
  });

  // Create initial state
  let state = createFreshState();

  // Function to completely reset interaction system
  const resetInteractions = () => {
    // Clean up existing state
    if (state.holdTimer !== null) {
      clearTimeout(state.holdTimer);
      state.holdTimer = null;
    }

    if (state.holdIndicator && state.holdIndicator.parentNode) {
      state.holdIndicator.parentNode.removeChild(state.holdIndicator);
      state.holdIndicator = null;
    }

    // Clean up all ripples
    clearRippleContainer();

    // Create completely new state object (not just reset properties)
    state = createFreshState();

    Logger.debug(`Interaction state fully reset for ${instanceId}`);
  };

  // Create pointer down handler with enclosed fresh state
  const createHandlerWithFreshState = () => {
    return function pointerDownHandler(ev: PointerEvent) {
      // Reset flags for this interaction
      state.holdTriggered = false;
      state.pendingHoldAction = false;
      state.activePointerId = ev.pointerId;

      // Detect touch devices
      const isTouch = ev.pointerType === 'touch';

      // Create visual ripple and track it
      const ripple = createRippleEffect(ev, rippleContainer);
      activeRipples.push(ripple);

      // Set up hold timer with proper state access
      if (config.hold_action && config.hold_action.action !== 'none') {
        // Clear existing timer
        if (state.holdTimer !== null) {
          clearTimeout(state.holdTimer);
          state.holdTimer = null;
        }

        // Create new timer that only marks state
        state.holdTimer = window.setTimeout(() => {
          if (state.activePointerId === ev.pointerId) {
            Logger.debug(`Hold threshold reached for ${instanceId}`, { state });

            // Mark pending hold action - NOT executing it yet
            state.holdTriggered = true;
            state.pendingHoldAction = true;

            // Create hold indicator
            state.holdIndicator = createHoldIndicator(ev);

            // Optional haptic feedback for touch devices
            if (isTouch && window.navigator.vibrate) {
              try {
                window.navigator.vibrate(50);
              } catch (e) {
                // Ignore vibration errors
              }
            }
          }
        }, 500);
      }

      // Movement tracking for this interaction
      let hasMoved = false;
      const startX = ev.clientX;
      const startY = ev.clientY;

      const handlePointerMove = (moveEv: PointerEvent) => {
        // Skip if not our pointer
        if (state.activePointerId !== ev.pointerId) return;

        // Calculate movement
        const dx = moveEv.clientX - startX;
        const dy = moveEv.clientY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 10) {
          hasMoved = true;
          // Cancel hold timer on movement
          if (state.holdTimer !== null) {
            clearTimeout(state.holdTimer);
            state.holdTimer = null;
          }
        }
      };

      const handlePointerUp = (upEv: PointerEvent) => {
        // Remove move listener
        window.removeEventListener('pointermove', handlePointerMove);

        // Skip if not our pointer
        if (state.activePointerId !== ev.pointerId) return;

        // Clear hold timer
        if (state.holdTimer !== null) {
          clearTimeout(state.holdTimer);
          state.holdTimer = null;
        }

        // Reset pointer tracking
        state.activePointerId = null;

        // Execute proper action based on state
        if (state.pendingHoldAction && !hasMoved) {
          // Hold action triggers ON RELEASE
          Logger.debug(`Executing hold action on pointer up for ${instanceId}`, { state });
          if (config.hold_action && config.hold_action.action !== 'none') {
            handleAction(config.hold_action, hass, element, entityId, toggleExpanded);
            state.lastActionTime = Date.now();
          }

          state.pendingHoldAction = false;
        } else if (
          !state.holdTriggered &&
          !hasMoved &&
          config.tap_action &&
          config.tap_action.action !== 'none'
        ) {
          // Tap action if no hold or movement
          Logger.debug(`Executing tap action for ${instanceId}`, { state });
          handleAction(config.tap_action, hass, element, entityId, toggleExpanded);
          state.lastActionTime = Date.now();
        }

        // Clean up hold indicator
        if (state.holdIndicator && state.holdIndicator.parentNode) {
          removeHoldIndicator(state.holdIndicator);
          state.holdIndicator = null;
        }

        // Reset hold state
        state.holdTriggered = false;
        state.pendingHoldAction = false;

        // Fade out ripple after a delay
        setTimeout(() => {
          // Safe removal - check if ripple is still in array
          const index = activeRipples.indexOf(ripple);
          if (index !== -1) {
            removeRippleEffect(ripple, 100);
            activeRipples.splice(index, 1);
          }
        }, 100);

        // Remove temporary event listeners
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerCancel);
      };

      const handlePointerCancel = () => {
        // Remove move listener
        window.removeEventListener('pointermove', handlePointerMove);

        // Clear hold timer
        if (state.holdTimer !== null) {
          clearTimeout(state.holdTimer);
          state.holdTimer = null;
        }

        // Reset tracking state
        state.activePointerId = null;
        state.holdTriggered = false;
        state.pendingHoldAction = false;

        // Clean up hold indicator
        if (state.holdIndicator && state.holdIndicator.parentNode) {
          removeHoldIndicator(state.holdIndicator);
          state.holdIndicator = null;
        }

        // Remove ripple
        const index = activeRipples.indexOf(ripple);
        if (index !== -1) {
          removeRippleEffect(ripple);
          activeRipples.splice(index, 1);
        }

        // Remove event listeners
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerCancel);
      };

      // Add global listeners
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('pointerup', handlePointerUp, { once: true });
      window.addEventListener('pointercancel', handlePointerCancel, { once: true });
    };
  };

  // Create initial handler
  let currentHandler = createHandlerWithFreshState();

  // Attach handler to element
  element.addEventListener('pointerdown', currentHandler);

  // Navigation handler with complete state recreation
  const navigationListener = () => {
    Logger.info(`Navigation detected for ${instanceId}, rebuilding interaction system`);

    // Use longer delay to ensure DOM is ready
    setTimeout(() => {
      if (element.isConnected) {
        // 1. Remove existing handler
        element.removeEventListener('pointerdown', currentHandler);

        // 2. Reset all state and clear DOM
        resetInteractions();

        // 3. Create completely fresh handler
        currentHandler = createHandlerWithFreshState();

        // 4. Attach new handler
        element.addEventListener('pointerdown', currentHandler);

        Logger.debug(`Interaction system fully rebuilt after navigation for ${instanceId}`);
      }
    }, 250);
  };

  // Add navigation listener
  window.addEventListener('location-changed', navigationListener);

  // Return cleanup function
  return () => {
    element.removeEventListener('pointerdown', currentHandler);
    window.removeEventListener('location-changed', navigationListener);
    resetInteractions();
    Logger.debug(`Interaction system cleanup complete for ${instanceId}`);
  };
}
