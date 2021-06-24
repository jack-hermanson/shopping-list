import { FC, FormEvent, useEffect, useState } from "react";
import {
    CategoryRecord,
    CreateEditCategoryRequest,
} from "../../../../shared/resource_models/category";
import { Button, FormGroup, Input, Label } from "reactstrap";

interface Props {
    onSubmit: (request: CreateEditCategoryRequest) => any;
    existingCategory?: CategoryRecord;
}

export const CreateEditCategoryForm: FC<Props> = ({
    onSubmit,
    existingCategory,
}: Props) => {
    const defaultName = existingCategory?.name || "";
    const defaultNotes = existingCategory?.notes || "";
    const defaultVisible = existingCategory ? existingCategory.visible : true;

    const [name, setName] = useState<string>(defaultName);
    const [notes, setNotes] = useState<string>(defaultNotes);
    const [visible, setVisible] = useState<boolean>(defaultVisible);

    useEffect(() => {
        if (existingCategory) {
            setName(defaultName);
            setNotes(defaultNotes);
            setVisible(defaultVisible);
        }
    }, [
        existingCategory,
        setName,
        setNotes,
        setVisible,
        defaultName,
        defaultNotes,
        defaultVisible,
    ]);

    return (
        <form onSubmit={submitForm} onReset={resetForm}>
            {renderName()}
            {renderNotes()}
            {renderVisibility()}
            {renderButtons()}
        </form>
    );

    function submitForm(event: FormEvent) {
        event.preventDefault();
        onSubmit({
            name,
            notes,
            visible,
        });
    }

    function resetForm(event: FormEvent) {
        event.preventDefault();
        setName(defaultName);
        setNotes(defaultNotes);
        setVisible(existingCategory ? existingCategory.visible : true);
        document.getElementById("category-name-input")?.focus();
    }

    function renderName() {
        const id = "category-name-input";
        return (
            <FormGroup>
                <Label for={id} className="form-label required">
                    Name
                </Label>
                <Input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    id={id}
                    autoFocus
                />
            </FormGroup>
        );
    }

    function renderNotes() {
        const id = "category-notes-input";
        return (
            <FormGroup>
                <Label for={id} className="form-label">
                    Notes
                </Label>
                <Input
                    type="text"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    id={id}
                    placeholder="A brief description"
                />
            </FormGroup>
        );
    }

    function renderVisibility() {
        const id = "category-visibility-input";
        return (
            <FormGroup>
                <Label className="form-label">Visibility</Label>
                <FormGroup check>
                    <Input
                        id={id}
                        type="checkbox"
                        checked={visible}
                        onChange={e => setVisible(e.target.checked)}
                    />
                    <Label for={id} className="form-check-label">
                        Visible
                    </Label>
                </FormGroup>
            </FormGroup>
        );
    }

    function renderButtons() {
        return (
            <div className="bottom-buttons">
                <Button type="submit" color="success">
                    Save
                </Button>
                <Button type="reset" color="secondary">
                    Reset
                </Button>
            </div>
        );
    }
};
