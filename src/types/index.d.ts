export type A11yGrade = 'pass' | 'fail'

export type WebAimResponse = {
    ratio: string
    AA: A11yGrade
    AALarge: A11yGrade
    AAA: A11yGrade
    AAALarge: A11yGrade
}

export type GradedColor = WebAimResponse & {
    color: string
}
