import { type ComponentProps, splitProps, Show, createMemo } from "solid-js"

// Regex to detect if a string starts with an emoji
const emojiRegex = /^(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)(?:\u200D(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F))*/u

function getFirstChar(str: string): { char: string; isEmoji: boolean } {
  if (!str) return { char: "", isEmoji: false }
  const match = str.match(emojiRegex)
  if (match) return { char: match[0], isEmoji: true }
  return { char: str[0] || "", isEmoji: false }
}

export interface AvatarProps extends ComponentProps<"div"> {
  fallback: string
  src?: string
  background?: string
  foreground?: string
  size?: "small" | "normal" | "large"
}

export function Avatar(props: AvatarProps) {
  const [split, rest] = splitProps(props, [
    "fallback",
    "src",
    "background",
    "foreground",
    "size",
    "class",
    "classList",
    "style",
  ])
  const src = split.src
  const firstChar = createMemo(() => getFirstChar(split.fallback))

  return (
    <div
      {...rest}
      data-component="avatar"
      data-size={split.size || "normal"}
      data-has-image={src ? "" : undefined}
      data-has-emoji={!src && firstChar().isEmoji ? "" : undefined}
      classList={{
        ...(split.classList ?? {}),
        [split.class ?? ""]: !!split.class,
      }}
      style={{
        ...(typeof split.style === "object" ? split.style : {}),
        ...(!src && !firstChar().isEmoji && split.background ? { "--avatar-bg": split.background } : {}),
        ...(!src && !firstChar().isEmoji && split.foreground ? { "--avatar-fg": split.foreground } : {}),
      }}
    >
      <Show
        when={src}
        fallback={
          <Show when={firstChar().isEmoji} fallback={firstChar().char}>
            <span data-slot="avatar-emoji">{firstChar().char}</span>
          </Show>
        }
      >
        {(src) => <img src={src()} draggable={false} data-slot="avatar-image" />}
      </Show>
    </div>
  )
}
