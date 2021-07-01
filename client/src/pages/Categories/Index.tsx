import { FC, useState, Fragment } from "react";
import {
    ConfirmationModal,
    LoadingSpinner,
    PageHeader,
} from "jack-hermanson-component-lib/lib";
import { Button, Col, Row } from "reactstrap";
import { ManageTabs } from "../../components/Manage/ManageTabs";
import { useProtectedRoute } from "../../utils/hooks";
import { Clearance } from "../../../../shared/enums";
import { CreateEditCategoryForm } from "../../components/Categories/CreateEditCategoryForm";
import { useStoreActions, useStoreState } from "../../stores/store";
import { ManageCategory } from "../../components/Categories/ManageCategory";
import { CategoryRecord } from "../../../../shared/resource_models/category";
import { capitalizeFirst, scrollToTop } from "jack-hermanson-ts-utils";

export const Index: FC = () => {
    useProtectedRoute(Clearance.ADMIN);

    const categories = useStoreState(state => state.categories);
    const currentUser = useStoreState(state => state.currentUser);
    const saveCategory = useStoreActions(actions => actions.saveCategory);
    const deleteCategory = useStoreActions(actions => actions.deleteCategory);
    const updateCategory = useStoreActions(actions => actions.updateCategory);

    const [formState, setFormState] = useState<"edit" | "new" | undefined>(
        undefined
    );
    const [categoryToEdit, setCategoryToEdit] = useState<
        CategoryRecord | undefined
    >(undefined);
    const [categoryToDelete, setCategoryToDelete] = useState<
        CategoryRecord | undefined
    >(undefined);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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
            {renderDeleteConfirmation()}
        </div>
    );

    function renderDeleteConfirmation() {
        if (categoryToDelete) {
            return (
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    setIsOpen={setShowDeleteModal}
                    title="Confirm Deletion"
                    onConfirm={async () => {
                        console.log("confirm deletion");
                        setShowDeleteModal(false);
                        await sendDeleteRequest(categoryToDelete.id);
                    }}
                    buttonColor="danger"
                    buttonText="Delete"
                >
                    <p className="mb-0">
                        Are you sure you want to delete the category{" "}
                        <strong>{categoryToDelete.name}</strong>?
                    </p>
                </ConfirmationModal>
            );
        }
    }

    async function sendDeleteRequest(categoryId: number) {
        if (currentUser?.token) {
            try {
                await deleteCategory({
                    token: currentUser.token,
                    id: categoryId,
                });
            } catch (error) {
                console.error(error);
                scrollToTop();
            }
        }
    }

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
                            deleteCategory={category => {
                                setCategoryToDelete(category);
                                setShowDeleteModal(true);
                                console.log({ category });
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
                onSubmit={async editedCategory => {
                    if (categoryToEdit && currentUser?.token) {
                        try {
                            await updateCategory({
                                id: categoryToEdit.id,
                                editedCategory,
                                token: currentUser.token,
                            });
                            setCategoryToEdit(undefined);
                            setFormState(undefined);
                        } catch (error) {
                            scrollToTop();
                            console.error(error);
                        }
                    }
                }}
            />
        );
    }

    function renderNewForm() {
        return (
            <CreateEditCategoryForm
                onSubmit={async newCategory => {
                    if (currentUser?.token) {
                        try {
                            await saveCategory({
                                newCategory,
                                token: currentUser.token,
                            });
                            setFormState(undefined);
                        } catch (error) {
                            scrollToTop();
                        }
                    }
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
                            color="info"
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
