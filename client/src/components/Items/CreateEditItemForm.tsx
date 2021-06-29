import {
    FC,
    FormEvent,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    CreateEditItemRequest,
    ItemRecord,
} from "../../../../shared/resource_models/item";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { useStoreState } from "../../store";
import { AlertPanel } from "jack-hermanson-component-lib/lib";

interface Props {
    onSubmit: (item: CreateEditItemRequest) => any;
    existingItem?: ItemRecord;
    autoFocus?: boolean;
}

export const CreateEditItemForm: FC<Props> = ({
    onSubmit,
    existingItem,
    autoFocus = false,
}: Props) => {
    const defaultName = existingItem?.name || "";
    const defaultNotes = existingItem?.notes || "";
    const defaultRepeats = existingItem ? existingItem.repeats : false;
    const defaultCategoryIds = useMemo(
        () => (existingItem ? existingItem.categoryIds : []),
        [existingItem]
    );

    const [name, setName] = useState(defaultName);
    const [notes, setNotes] = useState(defaultNotes);
    const [repeats, setRepeats] = useState(defaultRepeats);
    const [categoryIds, setCategoryIds] = useState(defaultCategoryIds);
    const [error, setError] = useState("");

    const categories = useStoreState(state => state.categories);

    const resetForm = useCallback(() => {
        console.log("reset form");
        setName(defaultName);
        setNotes(defaultNotes);
        setRepeats(defaultRepeats);
        setCategoryIds(defaultCategoryIds);
        setError("");
    }, [
        setName,
        defaultName,
        setNotes,
        defaultNotes,
        setRepeats,
        defaultRepeats,
        setCategoryIds,
        defaultCategoryIds,
        setError,
    ]);

    const idPrefix = useCallback(
        (field: string) =>
            `${existingItem ? existingItem.id : "new"}-item-${field}`,
        [existingItem]
    );

    useEffect(() => {
        console.log("use effect");
        if (existingItem) {
            resetForm();
        }
        if (autoFocus) {
            document.getElementById(idPrefix("name"))?.focus();
        }
    }, [existingItem, resetForm, autoFocus, idPrefix]);

    return (
        <form
            onSubmit={submitForm}
            onReset={e => {
                e.preventDefault();
                resetForm();
                document.getElementById(idPrefix("name"))?.focus();
            }}
        >
            {renderError()}
            {renderName()}
            {renderNotes()}
            {renderRepeats()}
            {renderCategories()}
            {renderButtons()}
        </form>
    );

    function submitForm(event: FormEvent) {
        event.preventDefault();
        if (!categoryIds.length) {
            setError("At least one category is required.");
            return;
        }

        onSubmit({
            name,
            checked: existingItem ? existingItem.checked : false,
            repeats,
            notes,
            categoryIds,
        });

        if (!existingItem) {
            resetForm();
        }
    }

    function renderError() {
        if (error) {
            return (
                <AlertPanel
                    alert={{ color: "danger", text: error }}
                    removeAlert={() => setError("")}
                />
            );
        }
    }

    function renderName() {
        const id = idPrefix("name");
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    Name
                </Label>
                <Input
                    value={name}
                    id={id}
                    onChange={e => setName(e.target.value)}
                    autoFocus={autoFocus}
                    required
                    placeholder="Item name"
                />
            </FormGroup>
        );
    }

    function renderNotes() {
        const id = idPrefix("notes");
        return (
            <FormGroup>
                <Label className="form-label" for={id}>
                    Notes
                </Label>
                <Input
                    value={notes}
                    id={id}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Optional..."
                />
            </FormGroup>
        );
    }

    function renderRepeats() {
        const id = idPrefix("item-repeats");
        return (
            <FormGroup>
                <Label className="form-label">Recurring</Label>
                <FormGroup check className="form-switch">
                    <Input
                        checked={repeats}
                        onChange={event => setRepeats(event.target.checked)}
                        type="checkbox"
                        id={id}
                    />
                    <Label for={id} className="form-check-label">
                        Item Repeats
                    </Label>
                </FormGroup>
            </FormGroup>
        );
    }

    function renderCategories() {
        return (
            <FormGroup>
                <Label className="form-label required">Categories</Label>
                {categories?.map(category => {
                    const id = idPrefix(`category-${category.id}`);
                    const alreadySelected = categoryIds.includes(category.id);
                    return (
                        <FormGroup key={category.id} check>
                            <Input
                                checked={alreadySelected}
                                type="checkbox"
                                id={id}
                                onChange={event => {
                                    const checked = event.target.checked;
                                    if (checked && !alreadySelected) {
                                        setCategoryIds(c => [
                                            ...c,
                                            category.id,
                                        ]);
                                    }
                                    if (!checked && alreadySelected) {
                                        setCategoryIds(selectedCategories =>
                                            selectedCategories.filter(
                                                c => c !== category.id
                                            )
                                        );
                                    }
                                }}
                            />
                            <Label for={id}>{category.name}</Label>
                        </FormGroup>
                    );
                })}
            </FormGroup>
        );
    }

    function renderButtons() {
        return (
            <div className="bottom-buttons">
                <Button type="submit" block color="info">
                    Submit
                </Button>
                <Button
                    className="mt-2"
                    size="sm"
                    type="reset"
                    block
                    color="dark"
                >
                    Reset
                </Button>
            </div>
        );
    }
};
