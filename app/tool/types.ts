export interface RedirectStep {
    url: string;
    status_code: number;
    // Add other fields as necessary
}

export interface Result {
    url: string;
    status_code?: number;
    redirect_steps: RedirectStep[]; // Ensure this is always an array
    response_time?: number;
    content_type?: string;
    meta_title?: string;
    meta_description?: string;
    h1_tags?: string[];
    initial_status_code: number; // Ensure this is always a number
    is_redirected: boolean; // Add this property
    // Add other fields as necessary
}

export interface SelectedFields {
    status_code: boolean;
    redirect_chain: boolean;
    response_time: boolean;
    content_type: boolean;
    meta_title: boolean;
    meta_description: boolean;
    h1_tags: boolean;
    // Add other fields as necessary
} 