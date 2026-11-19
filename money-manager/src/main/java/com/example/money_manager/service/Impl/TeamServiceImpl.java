package com.example.money_manager.service.Impl;

import com.example.money_manager.domain.Expense;
import com.example.money_manager.domain.Income;
import com.example.money_manager.domain.Profile;
import com.example.money_manager.domain.Team;
import com.example.money_manager.domain.enums.ProfileStatus;
import com.example.money_manager.dtos.ExpenseDto;
import com.example.money_manager.dtos.IncomeDto;
import com.example.money_manager.dtos.ProfileDto;
import com.example.money_manager.dtos.TeamDto;
import com.example.money_manager.mapper.ExpenseMapper;
import com.example.money_manager.mapper.IncomeMapper;
import com.example.money_manager.mapper.ProfileMapper;
import com.example.money_manager.mapper.TeamMapper;
import com.example.money_manager.repository.ExpenseRepository;
import com.example.money_manager.repository.IncomeRepository;
import com.example.money_manager.repository.ProfileRepository;
import com.example.money_manager.repository.TeamRepository;
import com.example.money_manager.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {
    private final TeamMapper teamMapper;
    private final TeamRepository teamRepository;
    private final ProfileRepository profileRepository;
    private final EmailService emailService;
    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final IncomeMapper incomeMapper;
    private final ExpenseMapper expenseMapper;
    private final ProfileMapper profileMapper;

    @Override
    public void sendInvitationToMember(Long ownerId, Long profileId) {
        profileRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String link = "http://localhost:5173/accept-invitation?ownerId=" + ownerId;

        String subject = "🎉 You're Invited to Join Our Expense Tracker!";

        String body = """
        <html>
        <body style="font-family: Arial, sans-serif; background-color:#f4f4f4; padding:40px;">
            <table style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px;
                          padding:40px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                <tr>
                    <td style="text-align:center;">
                        <h1 style="color:#2c3e50;">🎉 You're Invited!</h1>

                        <p style="font-size:16px; color:#555;">
                            Hello,
                        </p>

                        <p style="font-size:16px; color:#555; line-height:1.6;">
                            You've been invited to join an <strong>Expense Tracker Team</strong>.
                        </p>

                        <p style="font-size:16px; color:#555; line-height:1.6;">
                            Collaborate with your team, track shared expenses,
                            manage spending together, and stay on top of your finances
                            in one place.
                        </p>

                        <p style="font-size:16px; color:#555;">
                            Click the button below to accept your invitation and join the team.
                        </p>

                        <a href="%s"
                           style="display:inline-block;
                                  background:#2563eb;
                                  color:white;
                                  text-decoration:none;
                                  padding:14px 28px;
                                  border-radius:8px;
                                  font-size:16px;
                                  font-weight:bold;
                                  margin:20px 0;">
                            Click Here to Join the Team
                        </a>

                        <p style="font-size:14px; color:#888; margin-top:30px;">
                            If the button doesn't work, copy and paste this link into your browser:
                        </p>

                        <p style="font-size:13px; word-break:break-all; color:#2563eb;">
                            %s
                        </p>

                        <hr style="margin:30px 0; border:none; border-top:1px solid #eee;">

                        <p style="font-size:13px; color:#999;">
                            We look forward to tracking expenses together! 💰
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """.formatted(link, link);

        emailService.sendInvitation(profile.getEmail(), subject, body);
    }

    @Override
    public TeamDto acceptingInvitation(Long ownerId, Long userId) {
        if (ownerId.equals(userId)) {
            throw new RuntimeException("You cannot accept your own invitation");
        }

        Profile owner = profileRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        Profile user = profileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Team team = teamRepository.findByOwnerId(ownerId)
                .orElseGet(() -> teamRepository.save(
                        Team.builder()
                                .owner(owner)
                                .members(new ArrayList<>())
                                .build()
                ));

        if (team.getMembers().contains(user)) {
            throw new RuntimeException("User is already a member of this team");
        }

        if (team.getMembers().size() >= 3) {
            throw new RuntimeException("The team has reached the maximum number of members");
        }
        if (!team.getMembers().contains(owner)) {
            team.getMembers().add(owner);
        }

        owner.setStatus(ProfileStatus.TEAM);
        profileRepository.save(owner);

        user.setStatus(ProfileStatus.TEAM);
        profileRepository.save(user);

        team.getMembers().add(user);
        Team saved = teamRepository.save(team);

        return teamMapper.toDto(saved);
    }

    @Override
    public List<IncomeDto> getAllIncomesForTeam(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        List<IncomeDto> list = new ArrayList<>();

        for (Profile profile : team.getMembers()) {
            List<Income> incomes = incomeRepository.findTop5ByProfileIdOrderByDateDesc(profile.getId());
            list.addAll(incomes.stream().map(incomeMapper::toDto).toList());
        }
        return list;
    }

    @Override
    public List<ExpenseDto> getAllExpensesForTeam(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        List<ExpenseDto> list = new ArrayList<>();

        for (Profile profile : team.getMembers()) {
            List<Expense> expenses = expenseRepository.findTop5ByProfileIdOrderByDateDesc(profile.getId());
            list.addAll(expenses.stream().map(expenseMapper::toDto).toList());
        }
        return list;
    }

    @Override
    public List<ProfileDto> members(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        return team.getMembers().stream()
                .map(profileMapper::toDto)
                .toList();
    }
}