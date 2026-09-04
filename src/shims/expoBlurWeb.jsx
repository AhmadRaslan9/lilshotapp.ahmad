// بديل ويب بسيط لمكوّن BlurView من حزمة expo-blur.
// على الويب، تأثير الضبابية يُصنع بخاصية CSS العادية backdrop-filter،
// فلا حاجة لحزمة expo-blur الأصلية (المصممة أساساً لـ iOS/Android).
import React from 'react';

export function BlurView({ intensity = 40, tint = 'light', style, children, ...rest }) {
  const blurAmount = Math.min(Math.max(intensity, 0), 100) / 4;
  const tintBackground =
    tint === 'dark' ? 'rgba(0,0,0,0.35)' : tint === 'light' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.1)';

  return (
    <div
      style={{
        backdropFilter: `blur(${blurAmount}px)`,
        WebkitBackdropFilter: `blur(${blurAmount}px)`,
        backgroundColor: tintBackground,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export default { BlurView };