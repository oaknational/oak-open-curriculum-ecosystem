# Equality Impact Assessment (EqIA)

**Project:** Oak Curriculum MCP Streamable HTTP Application  
**Date:** September 2025  
**Version:** 1.0  
**Assessment Lead:** Development Team  
**Review Date:** September 2026

---

## 1. Executive Summary

This Equality Impact Assessment (EIA) evaluates the potential impact of the Oak Curriculum MCP Streamable HTTP Application on individuals with protected characteristics as defined by the Equality Act 2010. The application provides programmatic access to Oak National Academy's curriculum content through a Model Context Protocol (MCP) server interface.

**Note:** This assessment follows UK government guidance on equality impact assessments and Oak National Academy's internal EIA processes.

**Oak Context:** This EIA has been developed following Oak's established EIA framework, which emphasizes inclusive design, accessibility, and ensuring that educational technology serves all users equitably. The assessment draws on Oak's experience with curriculum accessibility and digital inclusion initiatives.

**Key Findings:**

- The application has been designed with accessibility considerations in mind
- No direct negative impacts on protected characteristics identified
- Positive impacts through improved access to educational resources
- Recommendations for enhanced accessibility features and monitoring

---

## 2. Assessment Process

### 2.1 Screening Phase

**Question:** Does this project require an Equality Impact Assessment?

**Assessment:** Yes - The Oak Curriculum MCP Streamable HTTP Application is a public-facing service that provides access to educational (curriculum) resources and may impact individuals with protected characteristics. The application serves educational technology developers and end users who may access curriculum content through consuming applications.

**Rationale:**

- The application provides access to educational content which may be used by diverse user groups
- Technical barriers could disproportionately affect certain protected groups
- The service has the potential to either promote or hinder equal access to educational resources

### 2.2 Scoping Phase

**Key Equality Issues Identified:**

- Accessibility of technical interfaces for users with disabilities
- Language barriers for non-English speakers
- Technical complexity creating barriers for certain user groups
- Potential indirect discrimination through consuming applications

**Protected Characteristics to Assess:**

All nine protected characteristics under the Equality Act 2010 will be evaluated:

- Age
- Disability
- Gender reassignment
- Marriage and civil partnership
- Pregnancy and maternity
- Race
- Religion or belief
- Sex
- Sexual orientation

**Additional Oak Inclusion Considerations:**

Following Oak's EIA framework, this assessment will also consider:

- **Socio-economic background:** Digital access, device requirements, and technical literacy barriers
- **Neuroinclusion:** Cognitive accessibility and diverse learning needs
- **Digital access and confidence:** Internet connectivity, device specifications, and technical skills
- **Language, literacy and cultural familiarity:** Plain language usage and cultural representation

---

## 3. Project Description

### 3.1 Purpose

The Oak Curriculum MCP Streamable HTTP Application is a technical service that exposes Oak National Academy's curriculum content through a standardized API interface. It enables developers and educational technology providers to programmatically access curriculum data, lesson plans, and educational resources.

### 3.2 Functionality

- **API Endpoint:** Provides RESTful API access to curriculum data
- **Authentication:** Bearer token-based authentication system
- **Data Access:** Retrieval of curriculum content, lesson summaries, and educational materials
- **Technical Interface:** JSON-based responses with structured data
- **Target Users:** Educational technology developers, curriculum designers, and educational content creators and consumers

### 3.3 Technical Specifications

- **Framework:** Express.js with TypeScript
- **Authentication:** OAuth 2.0 with JWT tokens (log in with Oak email)
- **Data Format:** JSON responses
- **Accessibility:** HTTP-based API with standard headers, no visual elements
- **Security:** CORS protection, DNS rebinding protection, host validation

### 3.4 Curriculum Context and Educational Impact

The MCP HTTP application provides access to Oak National Academy's curriculum content, which includes:

- **Lesson Plans and Resources:** Structured educational content across all subjects and key stages
- **Assessment Materials:** Quizzes, worksheets, and evaluation tools
- **Teacher Guidance:** Professional development and instructional support materials
- **Student Resources:** Age-appropriate content designed for diverse learning needs

**Educational Equity Considerations:**

- The API enables third-party developers to create educational applications that may reach diverse student and teacher populations
- Content accessibility through the API can support inclusive education practices
- Technical barriers may disproportionately affect schools with limited IT resources
- The structured data format supports assistive technologies and alternative learning approaches

---

## 3. Protected Characteristics Assessment

The Equality Act 2010 defines nine protected characteristics. This assessment evaluates the potential impact of the MCP HTTP application on each:

### 3.1 Age

**Assessment:** No direct age-based discrimination identified.

**Considerations:**

- The application is designed for technical users (developers, educational technologists)
- No age restrictions on API access
- Educational content may be more relevant to certain age groups, but this is content-dependent rather than application-dependent

**Impact:** Neutral to positive - provides equal access to educational resources regardless of user age.

### 3.2 Disability

**Assessment:** Potential accessibility barriers identified and addressed.

**Considerations:**

- **Visual Impairments:** API responses are in JSON format, compatible with screen readers
- **Motor Impairments:** Standard HTTP interface supports assistive technologies
- **Cognitive Impairments:** Clear, structured data format with consistent response patterns
- **Technical Barriers:** Requires technical knowledge to use effectively

**Mitigation Measures:**

- Comprehensive API documentation with examples
- Clear error messages and response codes
- Structured JSON responses for programmatic parsing
- Standard HTTP protocols for maximum compatibility

**Impact:** Positive - provides accessible data format for assistive technologies.

### 3.3 Gender Reassignment

**Assessment:** No gender-based discrimination identified.

**Considerations:**

- Application functionality is gender-neutral
- No gender-specific features or restrictions
- Educational content accessed through the API may contain gender-specific information, but this is content-dependent

**Impact:** Neutral - equal access regardless of gender identity.

### 3.4 Marriage and Civil Partnership

**Assessment:** No impact on marital status.

**Considerations:**

- No marital status requirements or restrictions
- Application access is not dependent on relationship status

**Impact:** Neutral - no impact on marital or civil partnership status.

### 3.5 Pregnancy and Maternity

**Assessment:** No impact on pregnancy or maternity status.

**Considerations:**

- No pregnancy or maternity-related restrictions
- Flexible API access supports various working arrangements
- No time-based restrictions that would disadvantage pregnant users

**Impact:** Neutral - no impact on pregnancy or maternity status.

### 3.6 Race

**Assessment:** No racial discrimination identified.

**Considerations:**

- Application functionality is race-neutral
- No racial profiling or restrictions
- Educational content may reflect diverse perspectives, but this is content-dependent and beyond the control of the application
- API responses are in English, which may present language barriers; however, the AI application using the server may mitigate that translating the content into the user's language

**Mitigation Measures:**

- Clear documentation in English
- Structured data format that can be translated by consuming applications
- No cultural or racial assumptions in technical implementation

**Impact:** Neutral to positive - provides equal access to educational resources.

### 3.7 Religion or Belief

**Assessment:** No religious discrimination identified.

**Considerations:**

- No religious requirements or restrictions
- Educational content may include religious education materials, but this is content-dependent and beyond the control of the application
- No religious symbols or assumptions in technical implementation

**Impact:** Neutral - equal access regardless of religious beliefs.

### 3.8 Sex

**Assessment:** No sex-based discrimination identified.

**Considerations:**

- Application functionality is sex-neutral
- No sex-specific features or restrictions
- Equal access for all users regardless of sex

**Impact:** Neutral - equal access regardless of sex.

### 3.9 Sexual Orientation

**Assessment:** No sexual orientation-based discrimination identified.

**Considerations:**

- No sexual orientation requirements or restrictions
- Application access is not dependent on sexual orientation
- Educational content may include LGBTQ+ inclusive materials, but this is content-dependent and beyond the control of the application

**Impact:** Neutral - equal access regardless of sexual orientation.

---

## 4. Consultation and Engagement

### 4.1 Consultation Strategy

Following UK government guidance on equality impact assessments, this section outlines the consultation process undertaken to gather diverse perspectives on the potential equality impacts of the MCP HTTP application.

### 4.2 Statutory Consultees

**Internal Stakeholders:**

- Development team and technical architects
- Accessibility specialists and user experience designers
- Legal and compliance team
- Educational content specialists

**External Stakeholders:**

- Educational technology developers
- Disability rights organizations
- Educational institutions and teachers
- End users from diverse backgrounds (teachers, parents, students, etc.)

### 4.3 Consultation Methods

**Phase 1: Internal Review (Completed)**

- Technical accessibility assessment by development team
- Legal review of equality compliance requirements
- Documentation review for accessibility guidelines

**Phase 2: Expert Consultation (Planned)**

- NA while this remains an internal experiment. This will be revisited when the application is made public.

**Phase 3: User Testing (Planned)**

- NA while this remains an internal experiment. This will be revisited when the application is made public.

### 4.4 Consultation Findings

**Completed Consultations:**

- Strong support for structured, accessible data formats
- Requests for comprehensive documentation
- Interest in enhanced error handling and user guidance

**Planned Consultations:**

- Accessibility testing with users with disabilities
- Feedback from educational technology community
- Review by equality and diversity specialists

## 5. Risk Assessment

### 5.1 Identified Risks

**High Risk:**

- None identified

**Medium Risk:**

- Technical complexity may create barriers for non-technical users; however, this is a technical product and not a user-facing one
- Limited accessibility features for users with specific disabilities, constrained by the technical nature of the application rather than by its design

**Low Risk:**

- Language barriers for non-English speakers; however, the AI application using the server may mitigate that translating the content into the user's language
- Potential for indirect discrimination through consuming applications

### 5.2 Risk Mitigation

**Technical Complexity:**

- Comprehensive documentation and examples
- Clear error messages and response codes
- Developer-friendly API design

**Accessibility:**

- Standard HTTP protocols for maximum compatibility
- Structured JSON responses for assistive technologies
- Clear, consistent response patterns

**Language Barriers:**

- English documentation with clear, simple language
- Structured data that can be translated by consuming applications

---

## 6. Decision-Making and Mitigation

### 6.1 Decision-Making Process

Following UK government guidance, this section outlines how the equality impact assessment findings will inform decision-making regarding the MCP HTTP application.

**Decision Framework:**

- All equality impacts have been identified and assessed
- Consultation responses have been considered
- Mitigation measures have been developed for identified risks
- Monitoring arrangements have been established

**Key Decisions:**

1. **Proceed with Development:** The application will proceed with identified mitigation measures
2. **Implement Accessibility Features:** Enhanced documentation and error handling will be implemented
3. **Establish Monitoring:** Regular review and monitoring systems will be put in place

### 6.2 Mitigation Measures

**For Technical Complexity Barriers:**

- Comprehensive API documentation with examples
- Clear error messages and response codes
- Developer-friendly API design
- Tutorial and getting-started guides

**For Accessibility Barriers:**

- Standard HTTP protocols for maximum compatibility
- Structured JSON responses for assistive technologies
- Clear, consistent response patterns
- WCAG 2.1 AA compliance considerations if a user interface is added

**For Language Barriers:**

- English documentation with clear, simple language
- Structured data that can be translated by consuming applications

---

## 7. Recommendations

### 7.1 Immediate Actions

1. **Enhanced Documentation:** Develop comprehensive API documentation
2. **Error Handling:** Implement clear, descriptive error messages
3. **Response Validation:** Ensure consistent response formats for programmatic parsing

### 7.2 Medium-term Improvements

1. **Accessibility Testing:** Conduct formal accessibility testing with users with disabilities
2. **User Feedback:** Implement feedback mechanisms for continuous improvement

### 7.3 Long-term Considerations

1. **Monitoring:** Establish regular monitoring of accessibility metrics
2. **Updates:** Regular review and update of accessibility features
3. **Partnership:** Collaborate with accessibility organizations for best practices

---

## 8. Post-Decision Monitoring

### 8.1 Monitoring Arrangements

- NA while this remains an internal experiment. This will be revisited when the application is made public.

### 8.2 Success Metrics

NA while this remains an internal experiment. This will be revisited when the application is made public.

Future metrics may include:

- User satisfaction scores
- Accessibility compliance metrics
- Error rates and resolution times
- Documentation usage and feedback
- Equality impact indicators

### 8.3 Review Schedule

- **Next Review:** September 2026
- **Trigger Events:** Significant application updates, user complaints, regulatory changes
- **Update Process:** Full EIA review and update as needed

---

## 9. Conclusion

This Equality Impact Assessment has been conducted in accordance with UK government guidance, the Public Sector Equality Duty under the Equality Act 2010, and Oak National Academy's established EIA framework. The assessment follows the structured approach outlined in government guidance, including screening, scoping, consultation, and monitoring phases.

The Oak Curriculum MCP Streamable HTTP Application has been designed with equality and accessibility considerations in mind, drawing on Oak's experience with curriculum accessibility and digital inclusion. While no direct negative impacts on protected characteristics have been identified, there are opportunities for improvement in documentation, error handling, and accessibility features.

The application provides positive impacts through improved access to educational resources and uses standard, accessible technical protocols. The recommendations outlined in this assessment will help ensure continued compliance with equality legislation and improved user experience for all users.

This assessment demonstrates compliance with the Public Sector Equality Duty and provides a framework for ongoing monitoring and improvement of equality outcomes, following Oak's commitment to inclusive design and continuous learning.

---

## 10. Approval and Sign-off

**Assessment Completed By:** Development Team  
**Date:** September 2025  
**Next Review Date:** September 2026

**Approved By:** [To be completed]  
**Date:** [To be completed]

**Compliance Statement:** This assessment has been conducted in accordance with the Equality Act 2010 and UK government guidance on equality impact assessments.

---

## 11. Appendices

### Appendix A: Technical Accessibility Standards

- WCAG 2.1 AA compliance considerations
- HTTP accessibility best practices
- JSON API accessibility guidelines

### Appendix B: Legal Framework

- Equality Act 2010 requirements
- Public Sector Equality Duty
- Accessibility regulations
- UK government guidance on equality impact assessments

---

_This Equality Impact Assessment is a living document and should be reviewed regularly to ensure continued compliance with equality legislation and best practices._
