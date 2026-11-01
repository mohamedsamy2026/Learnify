"use client";

import { useEffect, useRef, useState } from "react";
import {
  PlayCircle,
  VideoOff,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

function getVideoSource(value) {
  if (!value) return null;

  try {
    const url = new URL(value);

    if (url.protocol !== "https:") return null;

    const host = url.hostname.toLowerCase();
    let videoId = null;

    if (
      host === "youtube.com" ||
      host === "www.youtube.com" ||
      host === "m.youtube.com"
    ) {
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v");
      } else if (
        url.pathname.startsWith("/shorts/") ||
        url.pathname.startsWith("/embed/")
      ) {
        videoId = url.pathname.split("/")[2];
      }
    }

    if (host === "youtu.be") {
      videoId = url.pathname.slice(1);
    }

    if (
      videoId &&
      /^[a-zA-Z0-9_-]{11}$/.test(videoId)
    ) {
      return {
        type: "youtube",
        src: `https://www.youtube-nocookie.com/embed/${videoId}`,
      };
    }

    if (url.pathname.toLowerCase().endsWith(".mp4")) {
      return {
        type: "video",
        src: url.toString(),
      };
    }

    return null;
  } catch {
    return null;
  }
}

export default function VideoPlayer({
  lesson,
  initialPositionSeconds = 0,
  onProgressSave,
}) {
  const videoRef = useRef(null);
  const saveQueueRef = useRef(Promise.resolve());

  const lastRequestedPositionRef = useRef(
    Math.max(0, Math.floor(initialPositionSeconds))
  );

  const lastSaveTimeRef = useRef(0);
  const mountedRef = useRef(true);
  const onProgressSaveRef = useRef(onProgressSave);

  const [position, setPosition] = useState(
    Math.max(0, Math.floor(initialPositionSeconds))
  );

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // ORIGINAL CALLBACK HANDLING
  useEffect(() => {
    onProgressSaveRef.current = onProgressSave;
  }, [onProgressSave]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const source = getVideoSource(lesson?.video_url);

  // ORIGINAL PROGRESS SAVING LOGIC
  function savePosition(seconds, force = false) {
    if (
      !lesson?.lessonid ||
      typeof onProgressSaveRef.current !== "function"
    ) {
      return;
    }

    if (!Number.isFinite(seconds)) return;

    const nextPosition = Math.max(
      0,
      Math.floor(seconds)
    );

    if (
      nextPosition === lastRequestedPositionRef.current
    ) {
      return;
    }

    const now = Date.now();

    if (!force && now - lastSaveTimeRef.current < 15000) {
      return;
    }

    lastRequestedPositionRef.current = nextPosition;
    lastSaveTimeRef.current = now;

    const lessonId = lesson.lessonid;
    const saveCallback = onProgressSaveRef.current;

    saveQueueRef.current = saveQueueRef.current
      .catch(() => {})
      .then(async () => {
        if (mountedRef.current) {
          setSaving(true);
        }

        try {
          await saveCallback({
            lessonId,
            lastPositionSeconds: nextPosition,
          });

          if (mountedRef.current) {
            setSaveError("");
          }
        } catch {
          if (
            lastRequestedPositionRef.current ===
            nextPosition
          ) {
            lastRequestedPositionRef.current = -1;
          }

          if (mountedRef.current) {
            setSaveError(
              "Unable to save video position."
            );
          }
        } finally {
          if (mountedRef.current) {
            setSaving(false);
          }
        }
      });
  }

  // ORIGINAL RESUME LOGIC
  function handleMetadata(event) {
    const video = event.currentTarget;

    const savedPosition = Math.max(
      0,
      Number(initialPositionSeconds) || 0
    );

    if (
      !Number.isFinite(video.duration) ||
      video.duration <= 0
    ) {
      return;
    }

    if (
      savedPosition > 0 &&
      savedPosition < video.duration
    ) {
      video.currentTime = savedPosition;
      setPosition(Math.floor(savedPosition));
    }
  }

  // ================= UNAVAILABLE STATE =================

  if (!source) {
    return (
      <div className="flex aspect-video min-h-[250px] flex-col items-center justify-center rounded-3xl bg-[#12386F] px-6 text-center text-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-[#BBDDFF]">
          <VideoOff size={32} strokeWidth={1.5} />
        </div>

        <h3 className="mt-5 text-xl font-extrabold tracking-tight sm:text-2xl">
          Video unavailable
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-7 text-[#BBD5F4]">
          This lesson does not have a supported video
          source yet.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-[#12386F]">

      {/* ================= VIDEO AREA ================= */}

      <div className="relative aspect-video w-full overflow-hidden bg-black">

        {source.type === "youtube" ? (
          <iframe
            src={source.src}
            title={lesson.lessonname}
            className="h-full w-full"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            src={source.src}
            controls
            playsInline
            preload="metadata"
            className="h-full w-full bg-black object-contain"
            onLoadedMetadata={handleMetadata}
            onTimeUpdate={(event) => {
              const seconds =
                event.currentTarget.currentTime;

              setPosition(Math.floor(seconds));
              savePosition(seconds);
            }}
            onPause={(event) => {
              if (!event.currentTarget.ended) {
                savePosition(
                  event.currentTarget.currentTime,
                  true
                );
              }
            }}
            onEnded={(event) => {
              const duration =
                event.currentTarget.duration;

              if (Number.isFinite(duration)) {
                savePosition(duration, true);
              }
            }}
          />
        )}

      </div>

      {/* ================= PLAYER INFO BAR ================= */}

      <div className="flex min-h-[62px] flex-wrap items-center justify-between gap-3 px-5 py-3.5 text-sm text-blue-100 sm:px-6">

        {/* Lesson title */}
        <span className="flex min-w-0 flex-1 items-center gap-3">
          <PlayCircle
            size={20}
            strokeWidth={1.8}
            className="shrink-0 text-[#9CCBFF]"
          />

          <span className="min-w-0 truncate text-[13px] font-semibold text-white sm:text-sm">
            {lesson.lessonname}
          </span>
        </span>

        {/* Progress status */}
        {source.type === "youtube" ? (
          <span className="inline-flex items-center rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-[#C7DDF5]">
            Manual progress tracking
          </span>
        ) : saving ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-[#D5E9FF]">
            <LoaderCircle
              size={15}
              className="animate-spin"
            />
            Saving...
          </span>
        ) : saveError ? (
          <span
            role="status"
            className="inline-flex items-center gap-2 rounded-full bg-red-500/15 px-3.5 py-1.5 text-xs font-medium text-red-200"
          >
            <AlertCircle size={15} />
            {saveError}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-[#C7E5FF]">
            <CheckCircle2
              size={15}
              className="text-[#8BC5FF]"
            />
            {position}s played · Auto-save
          </span>
        )}
      </div>
    </div>
  );
}