const PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";

export default function AdSenseScript() {
  if (!PUB_ID) return null;

  return (
    <>
      <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUB_ID}`}
        crossOrigin="anonymous"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: "(adsbygoogle = window.adsbygoogle || []).push({});",
        }}
      />
    </>
  );
}
