import { FC } from "react";
import { HTTP } from "jack-hermanson-ts-utils";

interface Props {
    status: HTTP;
}

export const HttpError: FC<Props> = ({ status }: Props) => {
    let title: string;
    let body: string;

    switch (status) {
        case HTTP.NOT_FOUND:
            title = "404 Not Found";
            body = "What you're looking for doesn't exist. Highly unusual.";
            break;
        case HTTP.FORBIDDEN:
            title = "403 Forbidden";
            body = "What you're trying to do is not allowed.";
            break;
        default:
            title = "Error";
            body = "Something's gone wrong.";
            break;
    }

    return (
        <div>
            <h2>{title}</h2>
            <hr />
            <p className="lead">{body}</p>
        </div>
    );
};
