/**
 * Scroll Animations using Intersection Observer
 * This script handles animations that trigger when elements come into view during scrolling
 * Optimized for smooth animations and better performance
 */

// Options for the Intersection Observer - optimized for smoother triggering
const observerOptions = {
  root: null, // Use the viewport as the root
  rootMargin: '0px 0px -5% 0px', // Trigger animations slightly before elements fully enter viewport
  threshold: [0, 0.05, 0.15, 0.3], // Multiple thresholds for more precise triggering
};

// Function to handle intersection events with smoother animation control
function handleIntersection(entries, observer) {
  entries.forEach(entry => {
    // If the element is intersecting (visible)
    if (entry.isIntersecting) {
      // Slight delay for smoother appearance when scrolling quickly
      requestAnimationFrame(() => {
        // Add the 'visible' class to trigger the animation
        entry.target.classList.add('visible');
        
        // If the animation should only play once, unobserve the element
        if (entry.target.dataset.once === 'true') {
          observer.unobserve(entry.target);
        }
      });
    } else {
      // If the animation should reset when out of view
      if (entry.target.dataset.reset === 'true') {
        // Remove visible class more immediately to prevent janky resets
        entry.target.classList.remove('visible');
      }
    }
  });
}

// Create the observer
const observer = new IntersectionObserver(handleIntersection, observerOptions);

// Set up sequential animations for elements with data-sequence attribute
function setupSequentialAnimations() {
  // Find containers with sequential animation children
  document.querySelectorAll('[data-sequence]').forEach(container => {
    const children = Array.from(container.querySelectorAll('.scroll-animate, .scroll-up, .scroll-fade, .scroll-scale, .scroll-left, .scroll-right, .scroll-down'));
    
    // Get the base delay and increment from data attributes or use defaults
    const baseDelay = parseInt(container.dataset.baseDelay || 0);
    const increment = parseInt(container.dataset.increment || 100);
    
    // Apply increasing delays to each child with RAF for smoother timing
    children.forEach((child, index) => {
      child.style.transitionDelay = `${baseDelay + (index * increment)}ms`;
    });
  });
}

// Set up scroll progress animations with optimized performance
function setupScrollProgressAnimations() {
  const progressElements = document.querySelectorAll('[data-scroll-progress]');
  
  if (progressElements.length === 0) return;
  
  // Throttle function to limit update frequency
  function throttle(callback, limit = 16) { // ~60fps
    let waiting = false;
    return function() {
      if (!waiting) {
        callback.apply(this, arguments);
        waiting = true;
        setTimeout(() => {
          waiting = false;
        }, limit);
      }
    };
  }
  
  function updateProgress() {
    progressElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress as element moves through the viewport
      // 0 = just entered viewport, 1 = just left viewport
      let progress = 1 - (rect.top + rect.height) / (windowHeight + rect.height);
      
      // Clamp progress between 0 and 1
      progress = Math.min(Math.max(progress, 0), 1);
      
      // Only update the CSS property if the value has changed significantly
      const currentValue = parseFloat(element.style.getPropertyValue('--scroll-progress') || 0);
      if (Math.abs(progress - currentValue) > 0.01) {
        // Apply progress to custom property with precision
        element.style.setProperty('--scroll-progress', progress.toFixed(3));
      }
    });
  }
  
  // Use requestAnimationFrame for smooth scroll updates
  let rafId = null;
  window.addEventListener('scroll', () => {
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        updateProgress();
        rafId = null;
      });
    }
  }, { passive: true });
  
  // Initial update
  updateProgress();
}

// When the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Select all elements with scroll animation classes
  const animatedElements = document.querySelectorAll(
    '.scroll-animate, .scroll-fade, .scroll-up, .scroll-down, .scroll-left, .scroll-right, .scroll-scale'
  );
  
  // Use requestAnimationFrame for better performance when adding many observers at once
  if (animatedElements.length > 0) {
    requestAnimationFrame(() => {
      // Observe each animated element in batches to prevent layout thrashing
      const batchSize = 10;
      for (let i = 0; i < animatedElements.length; i += batchSize) {
        setTimeout(() => {
          const batch = Array.from(animatedElements).slice(i, i + batchSize);
          batch.forEach(element => observer.observe(element));
        }, 0);
      }
    });
  }
  
  // Set up sequential animations
  setupSequentialAnimations();
  
  // Set up scroll progress animations
  setupScrollProgressAnimations();
  
  // Add special class to body when animations are enabled
  document.body.classList.add('animations-enabled');
  
  // Add data-loaded attribute to body when page is fully loaded
  window.addEventListener('load', () => {
    document.body.setAttribute('data-loaded', true);
  });
});

// Handle animations for elements added dynamically with optimized observer
const mutationObserver = new MutationObserver(mutations => {
  // Batch new elements to observe
  const newAnimatedElements = [];
  
  for (const mutation of mutations) {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Check if the added element or any of its children has animation classes
          const nodeAnimatedElements = Array.from(node.querySelectorAll(
            '.scroll-animate, .scroll-fade, .scroll-up, .scroll-down, .scroll-left, .scroll-right, .scroll-scale'
          ));
          
          // Check if the node itself has animation classes
          if (
            node.classList && 
            (node.classList.contains('scroll-animate') || 
             node.classList.contains('scroll-fade') ||
             node.classList.contains('scroll-up') ||
             node.classList.contains('scroll-down') ||
             node.classList.contains('scroll-left') ||
             node.classList.contains('scroll-right') ||
             node.classList.contains('scroll-scale'))
          ) {
            nodeAnimatedElements.push(node);
          }
          
          // Add all new elements to the batch
          newAnimatedElements.push(...nodeAnimatedElements);
        }
      });
    }
  }
  
  // Observe all new elements with animation classes in one batch
  if (newAnimatedElements.length > 0) {
    requestAnimationFrame(() => {
      newAnimatedElements.forEach(element => observer.observe(element));
    });
  }
});

// Start observing the document body for DOM changes
mutationObserver.observe(document.body, {
  childList: true,
  subtree: true
});

// For better performance on mobile devices
let isMobile = window.matchMedia("(max-width: 768px)").matches;
let prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reduce motion if preferred or on mobile
if (prefersReducedMotion || isMobile) {
  document.body.classList.add('reduce-motion');
}

// Optimize performance by removing observers when tab is not visible
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden, disconnect observers to save resources
    mutationObserver.disconnect();
  } else {
    // Page is visible again, reconnect observers
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
});