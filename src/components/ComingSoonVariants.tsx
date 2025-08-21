import ComingSoon from './ComingSoon';

// Pre-configured Coming Soon components for different pages

export const ResearchComingSoon = () => (
  <ComingSoon
    title="Research Hub"
    subtitle="Deep crypto analysis is coming!"
    description="We're building the most comprehensive crypto research platform."
    customMessage="Our team of crypto analysts are working around the clock to bring you cutting-edge research tools and market intelligence. Join our waitlist to be the first to access exclusive reports and analysis!"
    showEmailInput={true}
  />
);

export const NewsroomComingSoon = () => (
  <ComingSoon
    title="Newsroom+"
    subtitle="Enhanced news experience loading..."
    description="Get ready for real-time crypto news with AI-powered insights."
    customMessage="We're revolutionizing how you consume crypto news. Advanced filtering, sentiment analysis, and personalized feeds are coming your way!"
    showEmailInput={true}
  />
);

export const AssetComingSoon = () => (
  <ComingSoon
    title="Asset Tracker"
    subtitle="Your portfolio companion!"
    description="Advanced portfolio tracking and analytics tools are in development."
    customMessage="Track, analyze, and optimize your crypto portfolio like never before. Real-time alerts, profit/loss tracking, and investment insights coming soon!"
    showEmailInput={true}
  />
);

export const ExchangeComingSoon = () => (
  <ComingSoon
    title="Exchange Hub"
    subtitle="All exchanges, one place!"
    description="Compare and access multiple crypto exchanges seamlessly."
    customMessage="The ultimate exchange aggregator is in the works. Compare prices, fees, and liquidity across all major platforms from one dashboard!"
    showEmailInput={true}
  />
);

export const AirdropComingSoon = () => (
  <ComingSoon
    title="Airdrop Central"
    subtitle="Never miss free tokens again!"
    description="Automated airdrop tracking and claiming system."
    customMessage="Discover, track, and claim airdrops effortlessly. Our smart notification system ensures you never miss valuable token distributions!"
    showEmailInput={true}
  />
);

export const ICOComingSoon = () => (
  <ComingSoon
    title="ICO/IDO Launchpad"
    subtitle="Early access to promising projects!"
    description="Curated launch platform for vetted crypto projects."
    customMessage="Get early access to the most promising crypto projects. Due diligence, whitelist access, and exclusive deals for our community!"
    showEmailInput={true}
  />
);

export const FundraisingComingSoon = () => (
  <ComingSoon
    title="Fundraising Platform"
    subtitle="Democratizing crypto investments!"
    description="Community-driven fundraising for crypto projects."
    customMessage="Participate in seed rounds, private sales, and community funding. Exclusive access to promising projects before they hit the market!"
    showEmailInput={true}
  />
);

export const KamusComingSoon = () => (
  <ComingSoon
    title="Kamus WEB3"
    subtitle="Your crypto dictionary!"
    description="Comprehensive Web3 and crypto terminology guide."
    customMessage="Learn crypto terminology like a pro! Interactive definitions, examples, and visual guides to master Web3 language!"
    showEmailInput={true}
  />
);

// Simple Coming Soon without email input
export const SimpleComingSoon = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <ComingSoon
    title={title}
    subtitle={subtitle}
    description="This feature is currently under development."
    showEmailInput={false}
  />
);

const ComingSoonVariants = {
  Research: ResearchComingSoon,
  Newsroom: NewsroomComingSoon,
  Asset: AssetComingSoon,
  Exchange: ExchangeComingSoon,
  Airdrop: AirdropComingSoon,
  ICO: ICOComingSoon,
  Fundraising: FundraisingComingSoon,
  Kamus: KamusComingSoon,
  Simple: SimpleComingSoon,
};

export default ComingSoonVariants;
