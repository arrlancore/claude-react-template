"use client";

import { useState } from "react";
import {
  Share2,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * @param title - The title of the shared content. e.g Article title
 * @param description - The description of the shared content. e.g Share this article if you found it helpful
 * @returns Share buttons component with notification
 */
export default function ShareButtons({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [hasShared, setHasShared] = useState(false);
  const [showThanksBadge, setShowThanksBadge] = useState(false);

  const shareToSocial = (platform: string) => {
    try {
      if (!hasShared) {
        setHasShared(true);
        setShowThanksBadge(true);
        setTimeout(() => setShowThanksBadge(false), 3000);
      }

      const url = window.location.href;
      const shareText = `${title}\n`;

      const shareLinks: Record<string, string> = {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      };

      const shareWindow = window.open(
        shareLinks[platform],
        "_blank",
        "noopener,noreferrer"
      );
      if (shareWindow) shareWindow.opener = null;
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowCopiedToast(true);
      if (!hasShared) {
        setHasShared(true);
        setShowThanksBadge(true);
        setTimeout(() => setShowThanksBadge(false), 3000);
      }
      setTimeout(() => setShowCopiedToast(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Social media platforms config
  const socialPlatforms = [
    {
      name: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      action: () => shareToSocial("whatsapp"),
    },
    {
      name: "twitter",
      label: "Twitter",
      icon: Twitter,
      action: () => shareToSocial("twitter"),
    },
    {
      name: "facebook",
      label: "Facebook",
      icon: Facebook,
      action: () => shareToSocial("facebook"),
    },
    {
      name: "linkedin",
      label: "LinkedIn",
      icon: Linkedin,
      action: () => shareToSocial("linkedin"),
    },
    {
      name: "copy",
      label: showCopiedToast ? "Copied!" : "Copy Link",
      icon: showCopiedToast ? Check : Copy,
      action: copyToClipboard,
    },
  ];

  return (
    <>
      {/* Success Notification */}
      {showThanksBadge && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4">
          <Badge
            variant="default"
            className="px-4 py-2 shadow-md flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>Thank you for sharing!</span>
          </Badge>
        </div>
      )}

      {/* Share Card */}
      <div className="w-full">
        <Card className="border-0 shadow-none overflow-hidden">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share This
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <p className="text-sm text-muted-foreground mb-4">{description}</p>

            <div className="flex flex-wrap gap-2 justify-center">
              {socialPlatforms.map((platform) => (
                <Button
                  key={platform.name}
                  onClick={platform.action}
                  variant={
                    platform.name === "copy"
                      ? showCopiedToast
                        ? "default"
                        : "outline"
                      : "outline"
                  }
                  size="sm"
                  className="rounded-full transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <platform.icon className="h-4 w-4 mr-1.5" />
                  <span className="text-xs">{platform.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
