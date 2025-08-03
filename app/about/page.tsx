import { Metadata } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGlobe,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import {
  faLinkedinIn,
  faChrome,
} from '@fortawesome/free-brands-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';

const domain = process.env.NEXT_PUBLIC_CANONICAL_URL;

export const metadata: Metadata = {
  title: 'About Prismiqo',
  description:
    'Empowering SEO professionals with innovative tools. Learn more about our mission and the creator behind Prismiqo.',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${domain}/about`,
  },
};

export default function About() {
  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white/90 sm:text-5xl md:text-6xl mb-4">
            About <span className="gradientText">Prismiqo</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-400/80 sm:text-lg md:text-xl">
            Empowering SEO professionals with innovative tools
          </p>
        </div>

        <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-8 backdrop-blur-sm transition-all duration-300 mb-12">
          <h2 className="text-3xl font-bold text-white/90 mb-4">Our Mission</h2>
          <p className="text-gray-400/80 mb-4 leading-relaxed">
            Prismiqo was born out of a passion to help fellow SEO professionals work more efficiently and effectively. As an SEO consultant with more than a decade of experience, I&apos;ve encountered numerous challenges in our field. This platform is my way of addressing those challenges by creating tools that can truly make a difference in our day-to-day work.
          </p>
          <p className="text-gray-400/80 leading-relaxed">
            My goal is to continually develop and refine tools that simplify complex SEO tasks, saving time and improving results for SEO professionals at all levels.
          </p>
        </div>

        <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-8 backdrop-blur-sm transition-all duration-300 mb-12">
          <h2 className="text-3xl font-bold text-white/90 mb-4">About the Creator</h2>
          <p className="text-gray-400/80 mb-4 leading-relaxed">
            I&apos;m Amin Foroutan, an SEO consultant with more than a decade of experience in the field. My passion for SEO and web development led me to create not just this platform, but also several Chrome extensions designed to enhance SEO workflows.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <a
              href="https://aminforoutan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-6 py-3 text-sm font-medium text-gray-300 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 hover:border-white/30 backdrop-blur-sm transition-all duration-300"
            >
              <FontAwesomeIcon icon={faGlobe} className="mr-2" /> Visit My Website
            </a>
            <a
              href="https://linkedin.com/in/ma-foroutan/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-6 py-3 text-sm font-medium text-gray-300 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 hover:border-white/30 backdrop-blur-sm transition-all duration-300"
            >
              <FontAwesomeIcon icon={faLinkedinIn} className="mr-2" /> Follow me on LinkedIn
            </a>
          </div>
        </div>

        <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-8 backdrop-blur-sm transition-all duration-300">
          <h2 className="text-3xl font-bold text-white/90 mb-4">Chrome Extensions</h2>
          <p className="text-gray-400/80 mb-6 leading-relaxed">
            In addition to Prismiqo, I&apos;ve developed several Chrome extensions to further assist SEO professionals. These extensions are designed to streamline various aspects of SEO work, from analyzing Google AI Overview to enhancing popular SEO tools.
          </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ExtensionCard
            title="Advanced GSC Visualizer"
            description="Advanced data visualization tool for Google Search Console that enables interactive charting and analysis"
            users="12,423"
            link="https://chromewebstore.google.com/detail/advanced-gsc-visualizer/cdiccpnglfpnclonhpchpaaoigfpieel"
          />
          <ExtensionCard
            title="AI Search Impact Analysis"
            description="Bulk keyword analysis for AI Overview status on Google search results"
            users="3,100"
            link="https://chromewebstore.google.com/detail/google-ai-overview-impact/bfaijiabgmdblmhbnangkgiboefomdfj"
          />
          <ExtensionCard
            title="SEO Render Insight Tool"
            description="Identifies server-side vs. client-side rendered elements"
            users="4,994"
            link="https://chromewebstore.google.com/detail/seo-render-insight-tool/ignachbibbeengfepmkeogegpfkigljc"
          />
          <ExtensionCard
            title="Google AI Citation Analysis"
            description="Compares cited websites in AI Overviews with traditional SERP results"
            users="2,095"
            link="https://chromewebstore.google.com/detail/google-ai-overview-citati/doobkkcnlfiglhoafllloikhabjgblae"
          />
          </div>
        </div>
      </div>
    </div>
  );
}

interface ExtensionCardProps {
  title: string;
  description: string;
  users: string;
  link: string;
}

function ExtensionCard({ title, description, users, link }: ExtensionCardProps) {
  return (
    <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-6 backdrop-blur-sm transition-all duration-300">
      <h3 className="text-xl font-semibold text-white/90 mb-2">{title}</h3>
      <p className="text-gray-400/80 mb-4 leading-relaxed">{description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          <FontAwesomeIcon icon={faUsers} className="mr-1" /> {users} users
        </span>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-gray-300 hover:text-white transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faChrome} className="mr-1" /> Add to Chrome
        </a>
      </div>
    </div>
  );
}
