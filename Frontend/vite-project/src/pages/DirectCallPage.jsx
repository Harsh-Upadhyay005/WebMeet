import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createDirectCallLink } from "../lib/api";
import { Link2, Copy, Check, Video, Send, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const DirectCallPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [generatedLink, setGeneratedLink] = useState(null);
  const [copied, setCopied] = useState(false);

  const createLinkMutation = useMutation({
    mutationFn: createDirectCallLink,
    onSuccess: (data) => {
      const callUrl = `${window.location.origin}/room/${data.room.roomId}`;
      setGeneratedLink({
        url: callUrl,
        room: data.room,
      });
      toast.success("Direct call link created!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create link");
    },
  });

  const handleCreateLink = (e) => {
    e.preventDefault();
    createLinkMutation.mutate(formData);
  };

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink.url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareViaEmail = () => {
    if (generatedLink) {
      const subject = encodeURIComponent(`Join my video call on WebMeet`);
      const body = encodeURIComponent(
        `Hi! I'd like to invite you to a video call.\n\nJoin here: ${generatedLink.url}\n\nNo account or friendship required - just click the link!`
      );
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }
  };

  const shareViaWhatsApp = () => {
    if (generatedLink) {
      const text = encodeURIComponent(
        `Join my video call on WebMeet: ${generatedLink.url}`
      );
      window.open(`https://wa.me/?text=${text}`, "_blank");
    }
  };

  const resetForm = () => {
    setGeneratedLink(null);
    setFormData({ name: "", description: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {!generatedLink ? (
          /* Create Link Form */
          <div className="card bg-base-100 border border-base-300 shadow-2xl">
            <div className="card-body p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Link2 className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Create Direct Call Link</h1>
                <p className="text-base-content/60">
                  Generate a shareable link for instant video calls - no friendship required!
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateLink} className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Call Name (Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Quick Catch-up"
                    className="input input-bordered w-full"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <label className="label">
                    <span className="label-text-alt text-base-content/60">
                      Leave blank to use your name
                    </span>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Description (Optional)
                    </span>
                  </label>
                  <textarea
                    placeholder="What's this call about?"
                    className="textarea textarea-bordered w-full h-24"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                {/* Features */}
                <div className="alert alert-info">
                  <Sparkles className="w-5 h-5" />
                  <div className="text-sm">
                    <strong>Direct call links:</strong> Anyone with the link can join, no account needed!
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full gap-2"
                  disabled={createLinkMutation.isPending}
                >
                  {createLinkMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Video className="w-5 h-5" />
                      Generate Call Link
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Generated Link Display */
          <div className="card bg-base-100 border border-base-300 shadow-2xl">
            <div className="card-body p-8">
              {/* Success Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
                  <Check className="w-8 h-8 text-success" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Link Created!</h1>
                <p className="text-base-content/60">
                  Share this link with anyone to start a video call
                </p>
              </div>

              {/* Link Display */}
              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text font-semibold">Your Call Link</span>
                </label>
                <div className="join w-full">
                  <input
                    type="text"
                    value={generatedLink.url}
                    readOnly
                    className="input input-bordered join-item flex-1 font-mono text-sm"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="btn btn-primary join-item"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Share Options */}
              <div className="space-y-3 mb-6">
                <p className="font-semibold mb-3">Share via:</p>
                <button
                  onClick={shareViaEmail}
                  className="btn btn-outline w-full gap-2"
                >
                  <Send className="w-5 h-5" />
                  Email
                </button>
                <button
                  onClick={shareViaWhatsApp}
                  className="btn btn-outline btn-success w-full gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp
                </button>
              </div>

              {/* Call Info */}
              <div className="alert">
                <div>
                  <div className="font-semibold">Link Details:</div>
                  <ul className="text-sm text-base-content/70 mt-2 space-y-1">
                    <li>• This link expires in 24 hours</li>
                    <li>• Maximum 2 participants</li>
                    <li>• No account required for guests</li>
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={resetForm}
                  className="btn btn-ghost flex-1"
                >
                  Create Another
                </button>
                <a
                  href={generatedLink.url}
                  className="btn btn-primary flex-1 gap-2"
                >
                  <Video className="w-5 h-5" />
                  Join Call Now
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectCallPage;
