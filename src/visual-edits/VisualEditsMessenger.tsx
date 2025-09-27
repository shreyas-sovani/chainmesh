"use client";

import { useEffect, useRef } from 'react';

interface VisualEditMessage {
  type: 'VISUAL_EDIT_UPDATE' | 'VISUAL_EDIT_SELECT' | 'VISUAL_EDIT_HOVER';
  payload: {
    componentName?: string;
    filePath?: string;
    elementId?: string;
    changes?: Record<string, any>;
    position?: { x: number; y: number };
  };
}

export default function VisualEditsMessenger() {
  const isInIframe = useRef(false);

  useEffect(() => {
    // Check if we're in an iframe (visual editing context)
    isInIframe.current = window !== window.parent;

    if (!isInIframe.current) {
      return;
    }

    // Listen for visual editing commands from parent frame
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type?.startsWith('VISUAL_EDIT_')) {
        handleVisualEditMessage(event.data as VisualEditMessage);
      }
    };

    // Send ready message to parent frame
    window.parent.postMessage({
      type: 'VISUAL_EDIT_READY',
      payload: {
        url: window.location.href,
        timestamp: Date.now()
      }
    }, '*');

    // Set up click handlers for component selection
    const handleElementClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const componentData = getComponentData(target);

      if (componentData) {
        event.preventDefault();
        event.stopPropagation();

        window.parent.postMessage({
          type: 'VISUAL_EDIT_COMPONENT_SELECTED',
          payload: componentData
        }, '*');
      }
    };

    // Set up hover handlers for component highlighting
    const handleElementHover = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const componentData = getComponentData(target);

      if (componentData) {
        target.style.outline = '2px solid #3b82f6';
        target.style.outlineOffset = '2px';

        window.parent.postMessage({
          type: 'VISUAL_EDIT_COMPONENT_HOVERED',
          payload: componentData
        }, '*');
      }
    };

    const handleElementLeave = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      target.style.outline = '';
      target.style.outlineOffset = '';
    };

    window.addEventListener('message', handleMessage);
    document.addEventListener('click', handleElementClick, true);
    document.addEventListener('mouseover', handleElementHover, true);
    document.addEventListener('mouseleave', handleElementLeave, true);

    return () => {
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('click', handleElementClick, true);
      document.removeEventListener('mouseover', handleElementHover, true);
      document.removeEventListener('mouseleave', handleElementLeave, true);
    };
  }, []);

  const getComponentData = (element: HTMLElement) => {
    const componentName = element.getAttribute('data-visual-edit-component');
    const filePath = element.getAttribute('data-visual-edit-file');

    if (!componentName || !filePath) {
      return null;
    }

    const rect = element.getBoundingClientRect();

    return {
      componentName,
      filePath,
      elementId: element.id || undefined,
      className: element.className || undefined,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      },
      bounds: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      }
    };
  };

  const handleVisualEditMessage = (message: VisualEditMessage) => {
    switch (message.type) {
      case 'VISUAL_EDIT_UPDATE':
        handleComponentUpdate(message.payload);
        break;
      case 'VISUAL_EDIT_SELECT':
        handleComponentSelect(message.payload);
        break;
      case 'VISUAL_EDIT_HOVER':
        handleComponentHover(message.payload);
        break;
    }
  };

  const handleComponentUpdate = (payload: VisualEditMessage['payload']) => {
    if (!payload.componentName || !payload.changes) return;

    // Find elements with matching component name
    const elements = document.querySelectorAll(
      `[data-visual-edit-component="${payload.componentName}"]`
    );

    elements.forEach((element) => {
      const htmlElement = element as HTMLElement;

      // Apply style changes
      if (payload.changes?.styles) {
        Object.assign(htmlElement.style, payload.changes.styles);
      }

      // Apply class changes
      if (payload.changes?.className) {
        htmlElement.className = payload.changes.className;
      }

      // Apply text content changes
      if (payload.changes?.textContent && htmlElement.textContent) {
        htmlElement.textContent = payload.changes.textContent;
      }
    });
  };

  const handleComponentSelect = (payload: VisualEditMessage['payload']) => {
    // Remove previous selections
    document.querySelectorAll('[data-visual-edit-selected="true"]').forEach((el) => {
      el.removeAttribute('data-visual-edit-selected');
      (el as HTMLElement).style.outline = '';
    });

    if (payload.componentName) {
      const elements = document.querySelectorAll(
        `[data-visual-edit-component="${payload.componentName}"]`
      );

      elements.forEach((element) => {
        element.setAttribute('data-visual-edit-selected', 'true');
        (element as HTMLElement).style.outline = '3px solid #10b981';
        (element as HTMLElement).style.outlineOffset = '2px';
      });
    }
  };

  const handleComponentHover = (payload: VisualEditMessage['payload']) => {
    // Remove previous hover states
    document.querySelectorAll('[data-visual-edit-hover="true"]').forEach((el) => {
      el.removeAttribute('data-visual-edit-hover');
      if (!el.getAttribute('data-visual-edit-selected')) {
        (el as HTMLElement).style.outline = '';
      }
    });

    if (payload.componentName) {
      const elements = document.querySelectorAll(
        `[data-visual-edit-component="${payload.componentName}"]`
      );

      elements.forEach((element) => {
        if (!element.getAttribute('data-visual-edit-selected')) {
          element.setAttribute('data-visual-edit-hover', 'true');
          (element as HTMLElement).style.outline = '2px solid #3b82f6';
          (element as HTMLElement).style.outlineOffset = '2px';
        }
      });
    }
  };

  // Only render visual editing UI if in iframe
  if (!isInIframe.current) {
    return null;
  }

  return (
    <div
      id="visual-edits-messenger"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 999999,
      }}
    >
      {/* Visual editing overlay indicators */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(59, 130, 246, 0.9)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
          pointerEvents: 'auto',
        }}
      >
        Visual Edit Mode
      </div>
    </div>
  );
}