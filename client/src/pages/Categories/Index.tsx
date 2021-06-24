import { FC, useState, Fragment } from "react";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib/lib";
import { Button, Col, Row } from "reactstrap";
import { ManageTabs } from "../../components/Manage/ManageTabs";
import { useProtectedRoute } from "../../utils/hooks";
import { Clearance } from "../../../../shared/enums";
import { CreateEditCategoryForm } from "../../components/Categories/CreateEditCategoryForm";
import { useStoreState } from "../../store";
import { ManageCategory } from "../../components/Categories/ManageCategory";
import { CategoryRecord } from "../../../../shared/resource_models/category";
import { capitalizeFirst } from "jack-hermanson-ts-utils";

export const Index: FC = () => {
    useProtectedRoute(Clearance.ADMIN);

    const categories = useStoreState(state => state.categories);

    const [formState, setFormState] = useState<"edit" | "new" | undefined>(
        undefined
    );
    const [categoryToEdit, setCategoryToEdit] = useState<
        CategoryRecord | undefined
    >(undefined);

    return (
        <div>
            <ManageTabs />
            {renderHeader()}
            <Row>
                <Col lg={6} className="mb-3 mb-lg-0">
                    <h4>Categories</h4>
                    {renderCategories()}
                </Col>
                <Col lg={6} className="sticky-top">
                    <h4>
                        {formState && capitalizeFirst(formState)}{" "}
                        {categoryToEdit
                            ? categoryToEdit.name
                            : formState === "new" && "Category"}
                    </h4>
                    {formState === "new" && renderNewForm()}
                    {formState === "edit" && renderEditForm()}
                </Col>
            </Row>
        </div>
    );

    function renderCategories() {
        if (categories) {
            return (
                <Fragment>
                    {categories.map(category => (
                        <ManageCategory
                            key={category.id}
                            category={category}
                            edit={category => {
                                setFormState("edit");
                                setCategoryToEdit(category);
                            }}
                        />
                    ))}
                </Fragment>
            );
        } else {
            return <LoadingSpinner />;
        }
    }

    function renderEditForm() {
        return (
            <CreateEditCategoryForm
                existingCategory={categoryToEdit}
                onSubmit={editedCategory => {
                    console.log("Edited to this:");
                    console.log(editedCategory);
                    setCategoryToEdit(undefined);
                    setFormState(undefined);
                }}
            />
        );
    }

    function renderNewForm() {
        return (
            <CreateEditCategoryForm
                onSubmit={newCategory => {
                    console.log("New category:");
                    console.log(newCategory);
                    setFormState(undefined);
                }}
            />
        );
    }

    function renderHeader() {
        return (
            <Row>
                <Col>
                    <PageHeader title="Manage Categories">
                        <Button
                            size="sm"
                            color="success"
                            onClick={() => {
                                setCategoryToEdit(undefined);
                                setFormState("new");
                            }}
                        >
                            New
                        </Button>
                    </PageHeader>
                </Col>
            </Row>
        );
    }
};
