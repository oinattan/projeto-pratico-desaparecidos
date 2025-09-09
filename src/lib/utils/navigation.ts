export const scrollToSection = (sectionId: string) => {
  const element = document.querySelector(sectionId) as HTMLElement;
  if (element) {

  const headerOffset = 80;
  const elementPosition = element.offsetTop;
  const offsetPosition = elementPosition - headerOffset;

  window.scrollTo({
  top: offsetPosition,
  behavior: "smooth"
  });
  }
};

export const navigateToSection = (
sectionId: string,
currentPath: string,
router: {push: (url: string) => void;}) =>
{
  if (currentPath === '/') {
  scrollToSection(sectionId);
  } else {
  router.push(`/${sectionId}`);
  }
};