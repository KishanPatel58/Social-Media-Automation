import {
  Construction,
  Sparkles,
  Clock3,
  ArrowLeft,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const ServiceNotAvailable = ({
  title = "Coming Soon",
  theme,
}) => {

  const navigate = useNavigate();

  return (
    <div
      className={`
        min-h-full
        w-full
        flex items-center
        justify-center
        select-none
        px-6

        transition-all duration-300

        ${
          theme === "light"
            ? "bg-[#f8fafc]"
            : "bg-[#0a0a0a]"
        }
      `}
    >

      {/* CARD */}

      <div
        className={`
          relative

          overflow-hidden

          max-w-2xl
          w-full

          rounded-3xl

          p-10 md:p-14

          transition-all duration-300

          ${
            theme === "light"

              ? "bg-white"

              : "bg-[#0a0a0a]"
          }
        `}
      >

        {/* CONTENT */}

        <div
          className="
            relative
            z-10

            flex flex-col
            items-center
            text-center
          "
        >

          {/* ICON */}

          <div
            className="
              relative

              flex items-center
              justify-center

              size-28

              rounded-full

              bg-[#FB2C36]/10

              border border-[#FB2C36]/30

              shadow-lg
              shadow-red-500/10
            "
          >

            <div
              className="
                absolute

                inset-0

                rounded-full

                animate-ping

                bg-[#FB2C36]/10
              "
            />

            <Construction
              strokeWidth={1.5}
              className="
                size-14
                text-[#FB2C36]
              "
            />
          </div>

          {/* BADGE */}

          <div
            className="
              mt-8

              flex items-center
              gap-2

              px-4 py-2

              rounded-full

              bg-[#FB2C36]/10

              border border-[#FB2C36]/20

              text-[#FB2C36]

              text-sm
              tracking-wide
            "
          >

            <Sparkles className="size-4" />

            New Feature In Progress
          </div>

          {/* TITLE */}

          <h1
            className={`
              mt-8

              text-4xl
              md:text-6xl

              font-bold
              tracking-tight

              ${
                theme === "light"
                  ? "text-slate-900"
                  : "text-white"
              }
            `}
          >
            {title}
          </h1>

          {/* DESCRIPTION */}

          <p
            className={`
              mt-5

              max-w-lg

              text-lg
              leading-relaxed

              ${
                theme === "light"
                  ? "text-slate-500"
                  : "text-slate-400"
              }
            `}
          >
            We're currently crafting this feature
            to deliver an amazing experience for
            you. Stay tuned — something awesome
            is on the way.
          </p>

          {/* INFO */}

          <div
            className="
              mt-10

              flex flex-wrap
              items-center
              justify-center

              gap-4
            "
          >

            <div
              className={`
                flex items-center
                gap-2

                px-4 py-3

                rounded-xl

                border

                ${
                  theme === "light"

                    ? "bg-slate-50 border-slate-200 text-slate-600"

                    : "bg-[#111111] border-[#ffffff10] text-slate-300"
                }
              `}
            >

              <Clock3 className="size-4 text-[#FB2C36]" />

              Under Development
            </div>

            {/* GO BACK BUTTON */}

            <button
              onClick={() => navigate(-1)}
              className="
                flex items-center
                gap-2

                px-5 py-3

                rounded-xl

                bg-[#FB2C36]

                text-white

                hover:scale-105
                hover:bg-[#e32630]

                active:scale-95

                transition-all duration-300
              "
            >

              <ArrowLeft className="size-4" />

              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceNotAvailable;