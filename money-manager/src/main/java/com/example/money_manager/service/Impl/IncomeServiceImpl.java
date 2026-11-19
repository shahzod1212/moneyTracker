package com.example.money_manager.service.Impl;

import com.example.money_manager.domain.Category;
import com.example.money_manager.domain.Income;
import com.example.money_manager.domain.Profile;
import com.example.money_manager.dtos.IncomeDto;
import com.example.money_manager.dtos.IncomeRequest;
import com.example.money_manager.mapper.IncomeMapper;
import com.example.money_manager.repository.CategoryRepository;
import com.example.money_manager.repository.IncomeRepository;
import com.example.money_manager.service.IncomeService;
import com.example.money_manager.service.ProfileService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
public class IncomeServiceImpl implements IncomeService {

    private ProfileService profileService;
    private CategoryRepository categoryRepository;
    private IncomeRepository incomeRepository;
    private IncomeMapper incomeMapper;

    @Override
    public IncomeDto create(IncomeRequest incomeRequest) {

        Profile profile = profileService.getCurrentProfile();

        Category category = categoryRepository.findById(incomeRequest.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category does not exist"));

        Income income = incomeMapper.toEntity(incomeRequest);
        income.setProfile(profile);
        income.setCategory(category);

        Income saved = incomeRepository.save(income);

        return incomeMapper.toDto(saved);
    }

    @Override
    public List<IncomeDto> getIncomeForCurrentUser() {

        Profile profile = profileService.getCurrentProfile();

        LocalDate now = LocalDate.now();
        LocalDate start = now.withDayOfMonth(1);
        LocalDate end = now.withDayOfMonth(now.lengthOfMonth());

        return incomeRepository
                .findByProfileIdAndDateBetween(profile.getId(), start, end)
                .stream()
                .map(incomeMapper::toDto)
                .toList();
    }

    @Override
    public void delete(Long id) {

        Profile profile = profileService.getCurrentProfile();

        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income not found"));

        if (!income.getProfile().getId().equals(profile.getId())) {
            throw new RuntimeException("Not authorized to delete this income");
        }

        incomeRepository.delete(income);
    }

    @Override
    public List<IncomeDto> getTop5Income() {

        Profile profile = profileService.getCurrentProfile();

        return incomeRepository.findTop5ByProfileIdOrderByDateDesc(profile.getId())
                .stream()
                .map(incomeMapper::toDto)
                .toList();
    }

    @Override
    public BigDecimal getTotalAmount() {

        Profile profile = profileService.getCurrentProfile();

        return incomeRepository.findTotalIncomeByProfileId(profile.getId());
    }

    @Override
    public List<IncomeDto> getFilterInformation(LocalDate start, LocalDate end, String name, Sort sort) {

        Profile profile = profileService.getCurrentProfile();

        List<IncomeDto> list = incomeRepository
                .findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(
                        profile.getId(),
                        start,
                        end,
                        name,
                        sort
                )
                .stream()
                .map(incomeMapper::toDto)
                .toList();

        return list;
    }
}