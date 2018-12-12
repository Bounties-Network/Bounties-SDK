export interface User {
    user: {
        id: number,
        categories: string[],
        languages: string[],
        skills: string[],
        page_preview: string,
        settings: any, // TODO make settings type
        public_address: string,
        name: string,
        email: string,
        wants_marketing_emails: boolean,
        dismissed_signup_prompt: string,
        organization: string,
        small_profile_image_url: string,
        large_profile_image_url: string,
        website: string,
        twitter: string,
        github: string,
        linkedin: string,
        dribble: string,
        created: string, // should this be a date??
        edited: string,
        last_viewed: string,
        last_logged_in: string,
        ens_domain: string,
    },
    stats: {
        awarded: number | null
        earned: number | null,
        issuer_ratings_given: number | null,
        issuer_ratings_received: number | null,
        fulfiller_ratings_given: number | null,
        fulfiller_ratings_received: number | null,
        issuer_fulfillment_acceptance: number | null,
        fulfiller_fulfillment_acceptance: number | null,
        total_bounties: number,
        total_fulfillments: number,
        total_fulfillments_on_bounties: number,
    }
}

export interface LoginResponse {
    user: User,
    hasSignedUp: boolean
}