import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const MarqueeSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll coordinates relative to this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Map scroll progress to horizontal translation
  // Row 1 slides left-to-right, Row 2 slides right-to-left
  const x1 = useTransform(scrollYProgress, [0, 1], [-150, 150]);
  const x2 = useTransform(scrollYProgress, [0, 1], [150, -150]);

  // List of high-res project mockups to display in the scrolling rows
  const row1Images = [
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
  ];

  const row2Images = [
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
  ];

  return (
    <div
      ref={containerRef}
      className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 w-full overflow-hidden flex flex-col gap-6 sm:gap-8 md:gap-10 select-none"
    >
      {/* Row 1 (Slides Right) */}
      <div className="flex w-[200vw] sm:w-[150vw] -translate-x-[20vw]">
        <motion.div style={{ x: x1 }} className="flex gap-4 sm:gap-6 md:gap-8 w-full">
          {row1Images.map((src, i) => (
            <div
              key={`row1-${i}`}
              className="flex-shrink-0 h-[130px] sm:h-[180px] md:h-[220px] aspect-[16/10] overflow-hidden rounded-[20px] sm:rounded-[30px] border border-[#D7E2EA]/10 shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
            >
              <img
                src={src}
                alt={`Premium UI screenshot ${i + 1}`}
                className="w-full h-full object-cover filter brightness-[0.85] hover:brightness-100 transition-all duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Row 2 (Slides Left) */}
      <div className="flex w-[200vw] sm:w-[150vw] -translate-x-[10vw]">
        <motion.div style={{ x: x2 }} className="flex gap-4 sm:gap-6 md:gap-8 w-full">
          {row2Images.map((src, i) => (
            <div
              key={`row2-${i}`}
              className="flex-shrink-0 h-[130px] sm:h-[180px] md:h-[220px] aspect-[16/10] overflow-hidden rounded-[20px] sm:rounded-[30px] border border-[#D7E2EA]/10 shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
            >
              <img
                src={src}
                alt={`Premium UI screenshot ${i + 6}`}
                className="w-full h-full object-cover filter brightness-[0.85] hover:brightness-100 transition-all duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
