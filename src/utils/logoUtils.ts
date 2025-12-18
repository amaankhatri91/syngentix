import finalytixDark from "@/assets/logos/finalytix-dark.svg";
import finalytixLight from "@/assets/logos/finalytix-light.svg";
import google from "@/assets/logos/google.svg";
import siginBottom from "@/assets/background/Back.svg";
import siginTop from "@/assets/background/Upper Back.svg";
import finalytixSmallDark from "@/assets/logos/finalytix-small-dark.png";
import finalytixSmallLight from "@/assets/logos/finalytix-small-light.png";
import sidebarOpen from "@/assets/switchIcon/open.svg";
import sidebarClose from "@/assets/switchIcon/close.svg";
import search from "@/assets/icons/search.svg";

export const siginLogo = (theme?: string) => {
  return theme === "light" ? finalytixLight : finalytixDark;
};

export const googleLogo = () => {
  return google;
};

export const siginBottomImg = () => {
  return siginBottom;
};

export const siginUpperImg = () => {
  return siginTop;
};

export const finalytixLogoSmall = (theme?: string) => {
  return theme === "light" ? finalytixSmallLight : finalytixSmallDark;
};

export const sidebarIcon = (isOpen?: boolean) => {
  return isOpen ? sidebarOpen : sidebarClose;
};

export const searchIcon = () => {
  return search;
};
