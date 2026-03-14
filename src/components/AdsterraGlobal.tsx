import { useEffect } from 'react';
import { ADSTERRA_KEY } from '../utils/config';

export default function AdsterraGlobal() {
  useEffect(() => {
    if (!ADSTERRA_KEY) return;

    // --- Social Bar / Popunder Injection ---
    // Adsterra usually provides a specific script for global formats.
    // Based on the user's request, we'll use the provided API key to inject the common invocation script.
    
    const socialBarScript = document.createElement('script');
    socialBarScript.type = 'text/javascript';
    socialBarScript.src = `//pl25925324.highrevenuenetwork.com/${ADSTERRA_KEY}/invoke.js`;
    socialBarScript.async = true;
    
    const popunderScript = document.createElement('script');
    popunderScript.type = 'text/javascript';
    popunderScript.src = `//pl25925325.highrevenuenetwork.com/${ADSTERRA_KEY}/invoke.js`;
    popunderScript.async = true;

    // Append scripts to the body
    document.body.appendChild(socialBarScript);
    document.body.appendChild(popunderScript);

    return () => {
      // Cleanup on unmount
      if (document.body.contains(socialBarScript)) {
        document.body.removeChild(socialBarScript);
      }
      if (document.body.contains(popunderScript)) {
        document.body.removeChild(popunderScript);
      }
    };
  }, []);

  // This component doesn't render anything visually
  return null;
}
