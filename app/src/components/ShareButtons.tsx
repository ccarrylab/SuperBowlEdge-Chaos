import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Twitter, Linkedin, Link, Check } from 'lucide-react'

interface ShareButtonsProps {
  title?: string
  text?: string
  url?: string
  hashtags?: string[]
}

export function ShareButtons({ 
  title = 'SuperBowl Edge Chaos',
  text = 'I just triggered real AWS chaos experiments and watched the infrastructure auto-heal! 🔥',
  url = 'https://chaos.ccarrylab.com/#/try',
  hashtags = ['DevOps', 'ChaosEngineering', 'AWS']
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${hashtags.join(',')}`
    window.open(twitterUrl, '_blank', 'width=550,height=420')
  }

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    window.open(linkedInUrl, '_blank', 'width=550,height=420')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Button
        variant="outline"
        size="sm"
        onClick={handleTwitterShare}
        className="bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border-[#1DA1F2]/30 text-[#1DA1F2]"
      >
        <Twitter className="w-4 h-4 mr-2" />
        Share on Twitter
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleLinkedInShare}
        className="bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border-[#0A66C2]/30 text-[#0A66C2]"
      >
        <Linkedin className="w-4 h-4 mr-2" />
        Share on LinkedIn
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className={copied ? 'bg-green-500/10 border-green-500/30 text-green-500' : ''}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Link Copied!
          </>
        ) : (
          <>
            <Link className="w-4 h-4 mr-2" />
            Copy Link
          </>
        )}
      </Button>
    </div>
  )
}

// Compact version for footer/small spaces
export function ShareButtonsCompact({ url = 'https://chaos.ccarrylab.com' }: { url?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, '_blank', 'width=550,height=420')}
        className="p-2 rounded-lg bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-4 h-4" />
      </button>
      <button
        onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'width=550,height=420')}
        className="p-2 rounded-lg bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </button>
      <button
        onClick={handleCopyLink}
        className={`p-2 rounded-lg transition-colors ${
          copied 
            ? 'bg-green-500/10 text-green-500' 
            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
        }`}
        aria-label="Copy link"
      >
        {copied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
      </button>
    </div>
  )
}
