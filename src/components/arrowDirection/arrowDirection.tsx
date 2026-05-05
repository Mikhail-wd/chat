import { useContext } from "react";
import { AppState } from "../../App";

function ArrowDirection() {
    const context = useContext(AppState)
    return (
            <svg viewBox="0 0 24 24" fill="none" stroke="white" width="24"
                height="24" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"  style={{ "rotate": `${context.data.users ? "0deg" : "180deg"}` }}>
                <line x1="4" y1="12" x2="18" y2="12"></line>
                <polyline points="12 6 18 12 12 18"></polyline>
            </svg>
    );
}

export default ArrowDirection;