import styled from "styled-components";

const categories = [
  "All",
  "Company",
  "Product",
  "Design",
  "Engineering",
  "Other",
];

const CategoryFilterContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const CategoryFilterContainerMobile = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
  overflow-x: auto;
  &::-webkit-scrollbar {
    height: 5px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
    border: 2px solid transparent;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
`;

const CategoryButton = styled.button`
  padding: 8px 14px;
  cursor: pointer;
  background-color: inherit;
  color: #000;
  border: none;
  border-radius: 20px;
  transition: background-color 0.3s, color 0.3s;

  &.active {
    background-color: #1976d2;
    color: #fff;
  }

  &:hover {
    background-color: #1976d2;
    color: #fff;
  }
`;

interface CategoryFilterProps {
  isMobile: boolean;
  selectedCategory: string | null;
  handleCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  isMobile,
  selectedCategory,
  handleCategoryChange,
}) => (
  <>
    {!isMobile ? (
      <CategoryFilterContainer>
        {categories.map((category) => (
          <CategoryButton
            key={category}
            className={
              selectedCategory === category ||
              (category === "All" && !selectedCategory)
                ? "active"
                : ""
            }
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </CategoryButton>
        ))}
      </CategoryFilterContainer>
    ) : (
      <CategoryFilterContainerMobile>
        {categories.map((category) => (
          <CategoryButton
            key={category}
            className={
              selectedCategory === category ||
              (category === "All" && !selectedCategory)
                ? "active"
                : ""
            }
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </CategoryButton>
        ))}
      </CategoryFilterContainerMobile>
    )}
  </>
);

export default CategoryFilter;
