import DOMPurify from "dompurify";
import "./NoData.scss"

interface NoDataProps {
    title?: string,
    text?: string,
}
export default function NoData({ title = "", text = "" }: NoDataProps) {
    return (
        <>
            <div className="no-data">
                <div className="no-data-container">
                    <div className="title">{title}</div>
                    <div className="text">
                        <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }}></span>
                    </div>
                </div >
            </div >
        </>
    )
}
