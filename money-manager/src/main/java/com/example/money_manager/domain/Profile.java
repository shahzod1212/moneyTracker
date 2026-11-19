package com.example.money_manager.domain;

import com.example.money_manager.domain.enums.ProfileStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "Profile")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "fullName", nullable = false)
    private String fullName;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "profileImage")
    private String profileImageUrl;

    @Enumerated(EnumType.STRING)
    private ProfileStatus status;

    @CreatedDate
    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private Boolean isActive=true;

    @Column(name = "activationToken")
    private String activationToken;

    @PrePersist
    public void prePersist(){
        if(this.isActive==null){
            isActive=true;
        }
    }
}
