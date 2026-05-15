export const Subtitles = ({ text }: { text: string }) => (
  <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-black/45 px-5 py-3 text-center text-xl font-semibold text-white shadow-2xl backdrop-blur-md">
    {text || "Subtitles will appear here."}
  </div>
);
