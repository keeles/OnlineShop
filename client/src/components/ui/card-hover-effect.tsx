import {cn} from "@/lib/utils";
import {AnimatePresence, motion} from "framer-motion";
import {useState} from "react";
import {Button} from "./button";
import {api} from "@/lib/api";
import {useNavigate} from "@tanstack/react-router";

export const HoverEffect = ({
  items,
  profile,
  className,
}: {
  items: {
    id: number;
    title: string;
    description: string;
    price: string;
    userId: string;
    createdAt: string | null;
    images: {
      id: number;
      url: string;
      name: string;
      productId: number;
    }[];
  }[];
  profile: boolean;
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const deleteListing = async (id: number) => {
    const deleted = await api.products[":id{[0-9]+}"].$delete({param: {id: id.toString()}});
    console.log(deleted);
    if (!deleted.ok) alert("error deleting item");
    const navigate = useNavigate();
    navigate({to: "/profile"});
  };
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-10", className)}>
      {items.map((item, idx) => (
        <a
          href={`/product/${item?.id}`}
          key={item?.id}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-marinaGreen/[0.7] block  rounded-3xl"
                layoutId="hoverBackground"
                initial={{opacity: 0}}
                animate={{
                  opacity: 1,
                  transition: {duration: 0.15},
                }}
                exit={{
                  opacity: 0,
                  transition: {duration: 0.15, delay: 0.2},
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            {profile ? (
              <Button
                variant="ghost"
                className="absolute top-0 right-0"
                onClick={(e) => {
                  e.preventDefault();
                  deleteListing(item.id);
                }}
              >
                X
              </Button>
            ) : (
              ""
            )}
            <CardTitle>{item.title}</CardTitle>
            {item.images ? (
              <CardDescription className="rounded-md overflow-hidden">
                <img src={item.images[0]?.url} alt="" />
              </CardDescription>
            ) : (
              ""
            )}
            <CardDescription>{item.description}</CardDescription>
            <CardDescription>${item.price}</CardDescription>
          </Card>
        </a>
      ))}
    </div>
  );
};

export const Card = ({className, children}: {className?: string; children: React.ReactNode}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-purple-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({className, children}: {className?: string; children: React.ReactNode}) => {
  return <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>{children}</h4>;
};
export const CardDescription = ({className, children}: {className?: string; children: React.ReactNode}) => {
  return <p className={cn("mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm", className)}>{children}</p>;
};
