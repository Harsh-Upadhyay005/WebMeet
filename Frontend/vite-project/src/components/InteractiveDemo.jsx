import { useState } from 'react';
import { Video, Mic, MicOff, VideoOff, Users } from 'lucide-react';

const InteractiveDemo = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [participants, setParticipants] = useState(3);

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-base-content/10">
      {/* Animated Grid Background */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(168,85,247,0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} 
      />
      
      {/* Main Video Area */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isVideoOn ? (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse">
              <Video className="w-12 h-12 text-white" />
            </div>
            <p className="text-base-content/70 font-medium">Camera Active</p>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-base-content/10">
              <VideoOff className="w-12 h-12 text-base-content/40" />
            </div>
            <p className="text-base-content/40 font-medium">Camera Off</p>
          </div>
        )}
      </div>

      {/* Participant Thumbnails */}
      <div className="absolute top-4 right-4 space-y-2">
        {[...Array(participants)].map((_, i) => (
          <div 
            key={i}
            className="w-20 h-14 rounded-lg backdrop-blur-xl bg-base-100/30 border border-base-content/10 flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
          >
            <Users className="w-5 h-5 text-base-content/50" />
          </div>
        ))}
      </div>

      {/* Status Indicators */}
      <div className="absolute top-4 left-4 flex gap-2">
        <div className="backdrop-blur-xl bg-base-100/30 border border-base-content/10 rounded-xl px-3 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-medium">Live</span>
        </div>
        <div className="backdrop-blur-xl bg-base-100/30 border border-base-content/10 rounded-xl px-3 py-2 flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span className="text-sm font-medium">{participants}</span>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="backdrop-blur-xl bg-base-100/40 border border-base-content/10 rounded-2xl px-4 py-3 flex items-center gap-3">
          {/* Mic Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-xl transition-all ${
              isMuted 
                ? 'bg-red-500/20 hover:bg-red-500/30' 
                : 'bg-base-content/5 hover:bg-base-content/10'
            }`}
          >
            {isMuted ? (
              <MicOff className="w-5 h-5 text-red-400" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          {/* Video Button */}
          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-3 rounded-xl transition-all ${
              !isVideoOn 
                ? 'bg-red-500/20 hover:bg-red-500/30' 
                : 'bg-base-content/5 hover:bg-base-content/10'
            }`}
          >
            {isVideoOn ? (
              <Video className="w-5 h-5" />
            ) : (
              <VideoOff className="w-5 h-5 text-red-400" />
            )}
          </button>

          {/* Add Participant Button */}
          <button
            onClick={() => setParticipants(Math.min(participants + 1, 6))}
            className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            <Users className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Hover Instruction */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity">
        <div className="backdrop-blur-xl bg-base-100/30 border border-base-content/10 rounded-lg px-4 py-2">
          <p className="text-xs text-base-content/60">Try the controls!</p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveDemo;
