import ComingSoonLite from '../../components/ComingSoonLite';

export const metadata = {
  title: 'Beluga AI - Artificial Intelligence for Crypto',
  description: 'Advanced AI-powered cryptocurrency analysis, predictions, and insights powered by Beluga AI.',
};

export default function BelugaAiPage() {
  return (
    <ComingSoonLite
      title="Beluga AI"
      subtitle="Artificial Intelligence for Crypto is coming!"
      description="We're building the most advanced AI-powered cryptocurrency analysis platform. Get ready for intelligent market predictions, risk analysis, and blockchain insights."
      customMessage="Our team of AI engineers and crypto experts are developing cutting-edge machine learning algorithms to revolutionize how you analyze cryptocurrency markets. From predictive analytics to automated risk assessment, Beluga AI will be your intelligent crypto companion. Join our waitlist to be the first to experience the future of crypto analysis!"
      showEmailInput={true}
    />
  );
}
