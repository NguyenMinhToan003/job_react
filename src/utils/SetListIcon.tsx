import {
  Heart, Laptop, Gift, Clock,
  GraduationCap, Users, Pizza, Bike, TrendingUp
} from "lucide-react";
import { JSX } from "react";

export const iconMap: Record<string, JSX.Element> = {
  heart: <Heart />,
  laptop: <Laptop />,
  gift: <Gift />,
  clock: <Clock />,
  "graduation-cap": <GraduationCap />,
  users: <Users />,
  pizza: <Pizza />,
  bike: <Bike />,
  "trending-up": <TrendingUp />,
};
