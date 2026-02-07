import { Github, Linkedin, Cloud } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Cohen Carryl</h3>
            <p className="text-sm text-gray-400">Senior DevOps Engineer</p>
            <p className="text-xs text-gray-500 mt-1">
              7+ years multi-cloud infrastructure
            </p>
            <p className="text-xs text-gray-500">
              11 AWS/GCP/Oracle certifications
            </p>
            
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://www.linkedin.com/in/cohen-h-carryl-3538b614/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              
              <a
                href="https://github.com/ccarrylab"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Cloud className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white">AWS Services</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span>CloudFront CDN</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span>API Gateway</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span>Lambda</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span>Application Load Balancer</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span>EC2 Auto Scaling</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span>VPC</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span>Route53 DNS</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span>ACM (SSL)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span>S3</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span>CloudWatch</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span>WAF</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span>FIS (Chaos)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span>IAM</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-white mb-3">Tech Stack</h3>
            <div className="space-y-2 text-xs text-gray-400">
              <div>
                <span className="font-semibold text-gray-300">Infrastructure:</span>
                <p>Terraform, HAProxy, Nginx</p>
              </div>
              <div>
                <span className="font-semibold text-gray-300">Frontend:</span>
                <p>React 19, TypeScript, Vite, Tailwind CSS</p>
              </div>
              <div>
                <span className="font-semibold text-gray-300">Backend:</span>
                <p>Python 3.11, boto3, Lambda</p>
              </div>
              <div>
                <span className="font-semibold text-gray-300">Animations:</span>
                <p>Framer Motion, tsParticles, Recharts</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Cohen Carryl. Super Bowl Edge Chaos Engineering Platform.</p>
          <p className="mt-1 text-xs">Production-grade edge infrastructure with real-time AWS metrics & chaos testing</p>
        </div>
      </div>
    </footer>
  );
}
