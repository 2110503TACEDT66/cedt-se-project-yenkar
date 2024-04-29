import React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { CommandCard } from "./CommandCard";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

export function CommandMenu({ session }: { session: Session | null }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const commandList = [
    { src: "/img/icon/home.svg", title: "Home", ref: "/" },
    { src: "/img/icon/car-side.svg", title: "Explore", ref: "/explore" },
  ];

  if (session?.user?.role === "carProvider") {
    commandList.push({
      src: "/img/icon/shop.svg",
      title: "My Store",
      ref: "/mystore",
    });

    commandList.push({
      src: "/img/icon/multiple.svg",
      title: "Add car",
      ref: "/add",
    });
  }

  if (session) {
    commandList.push(
      { src: "/img/icon/booking.svg", title: "Reservation", ref: "/manage" },
      { src: "/img/icon/apps.svg", title: "Dashboard", ref: "/dashboard" },
      { src: "/img/icon/user.svg", title: "Profile", ref: "/profile" },
      { src: "/img/icon/wallet.svg", title: "Balance", ref: "/balance" },
      {
        src: "/img/icon/exit.svg",
        title: "Logout",
        ref: "",
      }
    );
  } else {
    commandList.push({
      src: "/img/icon/enter.svg",
      title: "Sign-In",
      ref: "/sign-in",
    });
  }

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog
      className="bg-zinc-950 text-white"
      open={open}
      onOpenChange={setOpen}
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList className="scrollbar">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          {commandList.map((command) => (
            <CommandItem
              className="aria-selected:invert "
              onSelect={() => {
                if (command.title === "Logout") {
                  signOut();
                } else router.push(command.ref);
              }}
              onClick={() => {
                if (command.title === "Logout") {
                  signOut();
                } else router.push(command.ref);
              }}
              key={command.title}
            >
              <CommandCard
                src={command.src}
                title={command.title}
                action={command.ref}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
