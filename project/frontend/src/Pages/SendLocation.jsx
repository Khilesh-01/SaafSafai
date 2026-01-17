import { useState } from "react";

export default function LocationShareButton() {
  const [isSharing, setIsSharing] = useState(false);

  const shareLocation = async () => {
    if (!navigator.share) {
      alert("Sharing is not supported on this browser.");
      return;
    }

    if (isSharing) return; // ✅ Prevent multiple clicks
    setIsSharing(true);

    try {
      await navigator.share({
        title: "Lost & Found",
        text: "Check out this lost item I found!",
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    } finally {
      setIsSharing(false); // ✅ Reset after sharing
    }
  };

  return (
    <button
      onClick={shareLocation}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      disabled={isSharing} // ✅ Disable button while sharing
    >
      {isSharing ? "Sharing..." : "Share Location"}
    </button>
  );
}
