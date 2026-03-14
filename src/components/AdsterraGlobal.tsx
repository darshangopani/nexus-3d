import { useEffect } from 'react';

export default function AdsterraGlobal() {
  useEffect(() => {
    // --- Social Bar / Popunder Injection ---
    // Using specific script codes provided by the user
    
    const socialBarScript = document.createElement('script');
    socialBarScript.type = 'text/javascript';
    socialBarScript.src = `https://pl28916247.effectivegatecpm.com/a7/26/13/a726138373c781cfd11b73065d28d44e.js`;
    socialBarScript.async = true;
    
    const popunderScript = document.createElement('script');
    popunderScript.type = 'text/javascript';
    popunderScript.src = `https://pl28916244.effectivegatecpm.com/52/5f/fc/525ffca79db6765f7274268dea18ecae.js`;
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
